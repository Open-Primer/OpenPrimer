import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  checkAdminAuth,
  WIDGETS_LOCKS,
  pruneExpiredLocks,
  getWidgetsCatalog,
  saveWidgetsCatalog
} from './helpers/catalogHelpers';
import {
  extractLocaleKeysFromCode,
  updateDraftTranslationsCache,
  applyDraftTranslationsToLocales
} from './helpers/translationHelpers';
import {
  moderatePrompt,
  generateWidgetCodeWithAI
} from './helpers/llmHelpers';

const execPromise = promisify(exec);

export async function GET(request: Request) {
  try {
    const isAuthorized = await checkAdminAuth(request);
    if (!isAuthorized) {
      console.warn('[SECURITY] Unauthorized admin GET request on widgets API route.');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    pruneExpiredLocks();
    const catalog = getWidgetsCatalog();

    const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
    if (!fs.existsSync(mdxDir)) {
      return NextResponse.json({ success: false, error: 'MDX Directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(mdxDir);
    const widgets: any[] = [];

    for (const file of files) {
      if (!file.endsWith('.tsx')) continue;

      const widgetId = file.replace('.tsx', '');
      
      if (!catalog[widgetId]) continue;

      const filePath = path.join(mdxDir, file);
      const stat = fs.statSync(filePath);
      const code = fs.readFileSync(filePath, 'utf8');
      const linesCount = code.split('\n').length;
      
      const catalogInfo = catalog[widgetId];
      const hasBackup = fs.existsSync(`${filePath}.bak`) || !!catalogInfo.draft;

      const mergedInfo = catalogInfo.draft
        ? { ...catalogInfo, ...catalogInfo.draft, isDraft: true }
        : { ...catalogInfo, isDraft: false };

      const lock = WIDGETS_LOCKS[widgetId] || null;

      widgets.push({
        id: widgetId,
        fileName: file,
        sizeBytes: stat.size,
        linesCount,
        hasBackup,
        code,
        lock,
        ...mergedInfo
      });
    }

    return NextResponse.json({ success: true, widgets });
  } catch (err: any) {
    console.error('[API WIDGETS GET ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let filePath = '';
  let backupPath = '';
  let mdxContentPath = '';
  let mdxContentBackupPath = '';
  let isNew = false;
  let widgetId = '';

  try {
    const isAuthorized = await checkAdminAuth(request);
    if (!isAuthorized) {
      console.warn('[SECURITY] Unauthorized admin POST request on widgets API route.');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    pruneExpiredLocks();
    const body = await request.json();
    widgetId = body.widgetId;
    let code = body.code;
    const prompt = body.prompt;
    const action = body.action;
    const adminId = body.adminId || 'UnknownAdmin';
    const force = body.force || false;
    const metadata = body.metadata;

    if (!widgetId) {
      return NextResponse.json({ success: false, error: 'widgetId is required' }, { status: 400 });
    }

    if (prompt) {
      const moderation = moderatePrompt(prompt);
      if (!moderation.approved) {
        console.warn(`[API WIDGETS] Pre-flight moderation REJECTED prompt for "${widgetId}": "${prompt}"`);
        return NextResponse.json({
          success: false,
          error: moderation.reason
        }, { status: 400 });
      }
    }

    widgetId = widgetId.trim();
    widgetId = widgetId.charAt(0).toUpperCase() + widgetId.slice(1);

    // 1. HANDLE LOCKING ACTIONS
    if (action === 'lock') {
      const currentLock = WIDGETS_LOCKS[widgetId];
      if (currentLock && currentLock.adminId !== adminId && Date.now() < currentLock.expiresAt) {
        return NextResponse.json({
          success: false,
          error: `Widget is currently locked by ${currentLock.adminId}.`,
          lockedBy: currentLock.adminId,
          expiresAt: currentLock.expiresAt
        });
      }
      
      WIDGETS_LOCKS[widgetId] = {
        adminId,
        expiresAt: Date.now() + 2 * 60 * 1000
      };
      
      console.log(`[API WIDGETS] Lock acquired/renewed for "${widgetId}" by "${adminId}"`);
      return NextResponse.json({ success: true, lock: WIDGETS_LOCKS[widgetId] });
    }

    if (action === 'unlock') {
      const currentLock = WIDGETS_LOCKS[widgetId];
      if (currentLock) {
        if (currentLock.adminId === adminId || force) {
          delete WIDGETS_LOCKS[widgetId];
          console.log(`[API WIDGETS] Lock released for "${widgetId}" by "${adminId}" (force=${force})`);
          return NextResponse.json({ success: true });
        } else {
          return NextResponse.json({
            success: false,
            error: `Cannot unlock widget locked by ${currentLock.adminId} without force authorization.`,
            lockedBy: currentLock.adminId
          }, { status: 403 });
        }
      }
      return NextResponse.json({ success: true, message: 'Widget was not locked.' });
    }

    // 2. ENFORCE CONCURRENCY LOCK VALIDATION FOR MODIFYING OPERATIONS
    const activeLock = WIDGETS_LOCKS[widgetId];
    if (activeLock && activeLock.adminId !== adminId && Date.now() < activeLock.expiresAt) {
      return NextResponse.json({
        success: false,
        error: `Operation rejected. Widget is locked by ${activeLock.adminId}.`
      }, { status: 423 });
    }

    // 2.5 HANDLE DRAFT VALIDATE AND ROLLBACK ACTIONS
    if (action === 'validate') {
      const catalog = getWidgetsCatalog();
      const catalogInfo = catalog[widgetId];
      if (!catalogInfo) {
        return NextResponse.json({ success: false, error: 'Widget not found in catalog.' }, { status: 404 });
      }

      const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
      const widgetPath = path.join(mdxDir, `${widgetId}.tsx`);
      const backupFile = `${widgetPath}.bak`;

      const oldNameEN = catalogInfo.nameEN;
      const oldDescEN = catalogInfo.descEN;
      
      let newNameEN = catalogInfo.nameEN;
      let newDescEN = catalogInfo.descEN;
      let newNameFR = catalogInfo.nameFR;
      let newDescFR = catalogInfo.descFR;

      if (catalogInfo.draft) {
        newNameEN = catalogInfo.draft.nameEN || catalogInfo.nameEN;
        newDescEN = catalogInfo.draft.descEN || catalogInfo.descEN;
        newNameFR = catalogInfo.draft.nameFR || catalogInfo.nameFR;
        newDescFR = catalogInfo.draft.descFR || catalogInfo.descFR;
      }

      let oldKeys: string[] = [];
      let newKeys: string[] = [];

      if (fs.existsSync(backupFile)) {
        const oldCode = fs.readFileSync(backupFile, 'utf8');
        oldKeys = extractLocaleKeysFromCode(oldCode);

        if (fs.existsSync(widgetPath)) {
          const newCode = fs.readFileSync(widgetPath, 'utf8');
          newKeys = extractLocaleKeysFromCode(newCode);
        }
      }

      await applyDraftTranslationsToLocales(
        widgetId,
        oldNameEN,
        oldDescEN,
        oldKeys,
        newNameEN,
        newDescEN,
        newKeys
      );

      if (catalogInfo.draft) {
        catalog[widgetId] = {
          nameFR: newNameFR,
          nameEN: newNameEN,
          descFR: newDescFR,
          descEN: newDescEN,
          levelFR: catalogInfo.draft.levelFR || catalogInfo.levelFR,
          levelEN: catalogInfo.draft.levelEN || catalogInfo.levelEN,
          disciplines: catalogInfo.draft.disciplines || catalogInfo.disciplines
        };
      }

      saveWidgetsCatalog(catalog);

      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
        console.log(`[API WIDGETS] Validation successful. Deleted backup file at "${backupFile}"`);
      }

      return NextResponse.json({ success: true, message: `Widget "${widgetId}" officially validated!` });
    }

    if (action === 'rollback') {
      const catalog = getWidgetsCatalog();
      const catalogInfo = catalog[widgetId];
      
      const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
      const widgetPath = path.join(mdxDir, `${widgetId}.tsx`);
      const backupFile = `${widgetPath}.bak`;

      if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, widgetPath);
        fs.unlinkSync(backupFile);
        console.log(`[API WIDGETS] Rollback successful. Restored original file for "${widgetId}"`);
      }

      if (catalogInfo) {
        if (catalogInfo.draft) {
          delete catalogInfo.draft;
          saveWidgetsCatalog(catalog);
          console.log(`[API WIDGETS] Rollback metadata cleared draft for "${widgetId}"`);
        }
      }

      return NextResponse.json({ success: true, message: `Widget "${widgetId}" draft discarded and original restored!` });
    }

    // 3. HANDLE METADATA UPDATES
    if (metadata) {
      const catalog = getWidgetsCatalog();
      catalog[widgetId] = {
        ...catalog[widgetId],
        draft: {
          nameFR: metadata.nameFR || catalog[widgetId]?.draft?.nameFR || catalog[widgetId]?.nameFR || `Composant ${widgetId}`,
          nameEN: metadata.nameEN || catalog[widgetId]?.draft?.nameEN || catalog[widgetId]?.nameEN || `Component ${widgetId}`,
          descFR: metadata.descFR || catalog[widgetId]?.draft?.descFR || catalog[widgetId]?.descFR || "Composant interactif personnalisé pour l'enrichissement pédagogique.",
          descEN: metadata.descEN || catalog[widgetId]?.draft?.descEN || catalog[widgetId]?.descEN || "Custom interactive component built for pedagogical curriculum enrichment.",
          levelFR: metadata.levelFR || catalog[widgetId]?.draft?.levelFR || catalog[widgetId]?.levelFR || "Lycée / Université",
          levelEN: metadata.levelEN || catalog[widgetId]?.draft?.levelEN || catalog[widgetId]?.levelEN || "High School / University",
          disciplines: metadata.disciplines || catalog[widgetId]?.draft?.disciplines || catalog[widgetId]?.disciplines || ["General"]
        }
      };
      saveWidgetsCatalog(catalog);
      console.log(`[API WIDGETS] Saved catalog draft metadata for "${widgetId}"`);

      await updateDraftTranslationsCache(widgetId, {
        nameFR: catalog[widgetId].draft!.nameFR!,
        nameEN: catalog[widgetId].draft!.nameEN!,
        descFR: catalog[widgetId].draft!.descFR!,
        descEN: catalog[widgetId].draft!.descEN!
      }, undefined);

      if (!prompt && !code) {
        return NextResponse.json({
          success: true,
          message: `Parameters draft for widget "${widgetId}" updated successfully! Requires validation approval.`
        });
      }
    }
    
    const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
    filePath = path.join(mdxDir, `${widgetId}.tsx`);
    backupPath = `${filePath}.bak`;
    mdxContentPath = path.join(mdxDir, 'MdxContent.tsx');
    mdxContentBackupPath = `${mdxContentPath}.bak`;

    isNew = !fs.existsSync(filePath);

    if (prompt) {
      const aiResult = await generateWidgetCodeWithAI(widgetId, prompt, isNew, filePath);
      if (!aiResult.success) {
        return NextResponse.json({ success: false, error: aiResult.error }, { status: aiResult.status || 500 });
      }
      code = aiResult.code!;
    }

    if (!code) {
      return NextResponse.json({ success: false, error: 'Code is required if no prompt is provided' }, { status: 400 });
    }

    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`[API WIDGETS] Created backup for existing widget at "${backupPath}"`);
    }

    if (isNew && fs.existsSync(mdxContentPath)) {
      fs.copyFileSync(mdxContentPath, mdxContentBackupPath);
      console.log(`[API WIDGETS] Created backup for MdxContent at "${mdxContentBackupPath}"`);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[API WIDGETS] Wrote code to file at "${filePath}"`);

    if (isNew && fs.existsSync(mdxContentPath)) {
      let mdxContent = fs.readFileSync(mdxContentPath, 'utf8');
      
      const importInject = `import { ${widgetId} } from './${widgetId}';\n`;
      const importPos = mdxContent.indexOf("import { FillInBlanks");
      if (importPos !== -1) {
        mdxContent = mdxContent.slice(0, importPos) + importInject + mdxContent.slice(importPos);
      } else {
        mdxContent = importInject + mdxContent;
      }

      const componentsPos = mdxContent.indexOf("const components = {");
      if (componentsPos !== -1) {
        const insertIndex = mdxContent.indexOf("\n", componentsPos);
        if (insertIndex !== -1) {
          mdxContent = mdxContent.slice(0, insertIndex + 1) + `  ${widgetId},\n` + mdxContent.slice(insertIndex + 1);
        }
      }
      
      fs.writeFileSync(mdxContentPath, mdxContent, 'utf8');
      console.log(`[API WIDGETS] Registered component "${widgetId}" inside MdxContent.tsx`);
    }

    console.log(`[API WIDGETS] Compiling file at "${filePath}"...`);
    const compileCmd = `npx tsc --noEmit --skipLibCheck --jsx react-jsx --target es2022 --moduleResolution node --module commonjs "${filePath}"`;
    
    try {
      await execPromise(compileCmd);
      console.log(`[API WIDGETS] ✅ Widget "${widgetId}" compiled successfully! Clean compilation.`);
      
      if (fs.existsSync(mdxContentBackupPath)) fs.unlinkSync(mdxContentBackupPath);

      const newCodeKeys = extractLocaleKeysFromCode(code);
      await updateDraftTranslationsCache(widgetId, undefined, newCodeKeys);

      return NextResponse.json({
        success: true,
        message: isNew ? `Widget "${widgetId}" created and registered successfully!` : `Widget "${widgetId}" updated successfully as a draft!`,
        code
      });
    } catch (compileError: any) {
      console.error(`[API WIDGETS] ❌ Compilation failed for "${widgetId}". Output log:`, compileError.stdout || compileError.message);
      
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
        console.log(`[API WIDGETS SUCCESS ROLLBACK] Restored backup for existing file "${filePath}"`);
      } else if (isNew) {
        fs.unlinkSync(filePath);
        console.log(`[API WIDGETS SUCCESS ROLLBACK] Deleted faulty newly created file "${filePath}"`);
      }

      if (isNew && fs.existsSync(mdxContentBackupPath)) {
        fs.copyFileSync(mdxContentBackupPath, mdxContentPath);
        fs.unlinkSync(mdxContentBackupPath);
        console.log(`[API WIDGETS SUCCESS ROLLBACK] Restored backup for MdxContent.tsx`);
      }

      return NextResponse.json({
        success: false,
        error: 'TypeScript Compilation failed. Changes rolled back.',
        details: compileError.stdout || compileError.message
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error('[API WIDGETS POST ERROR]', err);
    
    if (filePath && fs.existsSync(backupPath)) {
      try { fs.copyFileSync(backupPath, filePath); fs.unlinkSync(backupPath); } catch {}
    }
    if (isNew && filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
    if (mdxContentPath && fs.existsSync(mdxContentBackupPath)) {
      try { fs.copyFileSync(mdxContentBackupPath, mdxContentPath); fs.unlinkSync(mdxContentBackupPath); } catch {}
    }

    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
