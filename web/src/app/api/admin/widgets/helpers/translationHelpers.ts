import fs from 'fs';
import path from 'path';
import { supabaseAdmin } from '@/lib/supabase';
import { getWidgetsCatalog, saveWidgetsCatalog } from './catalogHelpers';

export async function translateText(text: string, toLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${toLang.toLowerCase()}&dt=t&q=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      const data = await res.json();
      return data[0].map((x: any) => x[0]).join('').trim();
    }
  } catch (e) {
    console.error(`[API TRANSLATE] Translation to ${toLang} failed:`, e);
  }
  return trimmed;
}

export function extractLocaleKeysFromCode(code: string): string[] {
  const keys = new Set<string>();
  if (!code) return [];
  
  const tRegex = /\bt\(\s*["']((?:[^"\\]|\\.)*)["']\s*\)/g;
  let match;
  while ((match = tRegex.exec(code)) !== null) {
    if (match[1]) keys.add(match[1].replace(/\\/g, ''));
  }

  const trRegex = /\btr\(\s*["']((?:[^"\\]|\\.)*)["']\s*\)/g;
  while ((match = trRegex.exec(code)) !== null) {
    if (match[1]) keys.add(match[1].replace(/\\/g, ''));
  }

  const localeRegex = /\blocale(?:\?\.)?\[\s*["']((?:[^"\\]|\\.)*)["']\s*\]/g;
  while ((match = localeRegex.exec(code)) !== null) {
    if (match[1]) keys.add(match[1].replace(/\\/g, ''));
  }

  return Array.from(keys);
}

export async function updateLocalesForWidgetAndCodeKeys(
  oldNameEN: string | undefined,
  newNameEN: string,
  oldDescEN: string | undefined,
  newDescEN: string,
  nameFR: string,
  descFR: string,
  oldCodeKeys: string[],
  newCodeKeys: string[]
) {
  const standardLanguages = ['en', 'fr', 'es', 'de', 'zh', 'pt', 'ar', 'hi', 'ur'];
  let allLanguages = [...standardLanguages];

  try {
    const { data: dbLangs } = await supabaseAdmin
      .from('languages')
      .select('code');
    if (dbLangs && dbLangs.length > 0) {
      const dbCodes = dbLangs.map(l => l.code.toLowerCase());
      allLanguages = Array.from(new Set([...allLanguages, ...dbCodes]));
    }
  } catch (err) {
    console.error('[API LOCALES] Error fetching registered languages for dynamic localization:', err);
  }

  const localesDir = path.join(process.cwd(), 'src', 'app', 'admin', 'curriculum', 'locales');
  
  for (const lang of allLanguages) {
    const isStandard = standardLanguages.includes(lang);
    const filePath = path.join(localesDir, `${lang}.ts`);
    const record: Record<string, string> = {};

    if (isStandard && fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const entryRegex = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
        let match;
        while ((match = entryRegex.exec(content)) !== null) {
          record[match[1]] = match[2];
        }
      } catch (err) {
        console.error(`[API LOCALES] Error reading locale file ${lang}.ts:`, err);
      }
    }

    if (lang !== 'en') {
      try {
        const { data: paramData } = await supabaseAdmin
          .from('system_parameters')
          .select('value')
          .eq('key', `ui_strings_${lang.toUpperCase()}`)
          .single();
        if (paramData?.value) {
          const dbRecord = JSON.parse(paramData.value);
          Object.assign(record, dbRecord);
        }
      } catch (err) {
        console.warn(`[API LOCALES] No existing system_parameters found for key ui_strings_${lang.toUpperCase()}`);
      }
    }
    
    if (oldNameEN && record[oldNameEN] !== undefined) {
      delete record[oldNameEN];
    }
    if (oldDescEN && record[oldDescEN] !== undefined) {
      delete record[oldDescEN];
    }

    for (const oldKey of oldCodeKeys) {
      if (record[oldKey] !== undefined) {
        delete record[oldKey];
      }
    }
    
    if (lang === 'en') {
      record[newNameEN] = newNameEN;
      record[newDescEN] = newDescEN;
    } else {
      const directName = lang === 'fr' ? nameFR : null;
      const directDesc = lang === 'fr' ? descFR : null;
      record[newNameEN] = directName || await translateText(newNameEN, lang);
      record[newDescEN] = directDesc || await translateText(newDescEN, lang);
    }

    for (const newKey of newCodeKeys) {
      if (lang === 'en') {
        record[newKey] = newKey;
      } else {
        record[newKey] = await translateText(newKey, lang);
      }
    }
    
    if (isStandard) {
      try {
        let output = 'export const locale: Record<string, string> = {\n';
        for (const [k, v] of Object.entries(record)) {
          output += `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`;
        }
        output += '};\n';
        fs.writeFileSync(filePath, output, 'utf8');
        console.log(`[API LOCALES] Updated disk ${lang}.ts translations for "${newNameEN}" & visual keys`);
      } catch (err) {
        console.error(`[API LOCALES] Error writing locale file ${lang}.ts:`, err);
      }
    }

    if (lang !== 'en') {
      try {
        const { error: upsertError } = await supabaseAdmin
          .from('system_parameters')
          .upsert({
            key: `ui_strings_${lang.toUpperCase()}`,
            value: JSON.stringify(record),
            updated_at: new Date().toISOString()
          });
        if (upsertError) {
          console.error(`[API LOCALES] Error upserting ui_strings_${lang.toUpperCase()} to database:`, upsertError.message);
        } else {
          console.log(`[API LOCALES] Upserted database ui_strings_${lang.toUpperCase()} translations for "${newNameEN}"`);
        }
      } catch (err) {
        console.error(`[API LOCALES] Error updating database system_parameters for language ${lang}:`, err);
      }
    }
  }
}

export async function updateDraftTranslationsCache(
  widgetId: string,
  metadata: { nameFR: string; nameEN: string; descFR: string; descEN: string } | undefined,
  codeKeys: string[] | undefined
) {
  const catalog = getWidgetsCatalog();
  if (!catalog[widgetId]) return;
  if (!catalog[widgetId].draft) {
    catalog[widgetId].draft = {};
  }
  
  const draft = catalog[widgetId].draft!;
  if (!draft.draftTranslations) {
    draft.draftTranslations = {};
  }
  
  const standardLanguages = ['en', 'fr', 'es', 'de', 'zh', 'pt', 'ar', 'hi', 'ur'];
  let allLanguages = [...standardLanguages];

  try {
    const { data: dbLangs } = await supabaseAdmin
      .from('languages')
      .select('code');
    if (dbLangs && dbLangs.length > 0) {
      const dbCodes = dbLangs.map(l => l.code.toLowerCase());
      allLanguages = Array.from(new Set([...allLanguages, ...dbCodes]));
    }
  } catch (err) {
    console.error('[API LOCALES] Error fetching languages for draft cache:', err);
  }
  
  for (const lang of allLanguages) {
    if (!draft.draftTranslations[lang]) {
      draft.draftTranslations[lang] = {};
    }
  }

  if (metadata) {
    const { nameEN, nameFR, descEN, descFR } = metadata;
    for (const lang of allLanguages) {
      const record = draft.draftTranslations[lang];
      if (lang === 'en') {
        record[nameEN] = nameEN;
        record[descEN] = descEN;
      } else {
        const directName = lang === 'fr' ? nameFR : null;
        const directDesc = lang === 'fr' ? descFR : null;
        record[nameEN] = directName || await translateText(nameEN, lang);
        record[descEN] = directDesc || await translateText(descEN, lang);
      }
    }
  }

  if (codeKeys) {
    for (const key of codeKeys) {
      for (const lang of allLanguages) {
        const record = draft.draftTranslations[lang];
        if (lang === 'en') {
          record[key] = key;
        } else {
          record[key] = await translateText(key, lang);
        }
      }
    }
  }

  catalog[widgetId].draft = draft;
  saveWidgetsCatalog(catalog);
  console.log(`[API LOCALES] Updated draftTranslations cache for widget "${widgetId}"`);
}

export async function applyDraftTranslationsToLocales(
  widgetId: string,
  oldNameEN: string | undefined,
  oldDescEN: string | undefined,
  oldCodeKeys: string[],
  newNameEN: string,
  newDescEN: string,
  newCodeKeys: string[]
) {
  const catalog = getWidgetsCatalog();
  const catalogInfo = catalog[widgetId];
  if (!catalogInfo || !catalogInfo.draft || !catalogInfo.draft.draftTranslations) {
    console.warn(`[API LOCALES] No draftTranslations cache found for widget "${widgetId}". Falling back to on-the-fly translations.`);
    await updateLocalesForWidgetAndCodeKeys(
      oldNameEN, newNameEN,
      oldDescEN, newDescEN,
      catalogInfo?.nameFR || newNameEN, catalogInfo?.descFR || newDescEN,
      oldCodeKeys, newCodeKeys
    );
    return;
  }

  const draftTranslations = catalogInfo.draft.draftTranslations;
  const standardLanguages = ['en', 'fr', 'es', 'de', 'zh', 'pt', 'ar', 'hi', 'ur'];
  let allLanguages = [...standardLanguages];

  try {
    const { data: dbLangs } = await supabaseAdmin
      .from('languages')
      .select('code');
    if (dbLangs && dbLangs.length > 0) {
      const dbCodes = dbLangs.map(l => l.code.toLowerCase());
      allLanguages = Array.from(new Set([...allLanguages, ...dbCodes]));
    }
  } catch (err) {
    console.error('[API LOCALES] Error fetching languages for draft commit:', err);
  }

  const localesDir = path.join(process.cwd(), 'src', 'app', 'admin', 'curriculum', 'locales');

  for (const lang of allLanguages) {
    const isStandard = standardLanguages.includes(lang);
    const filePath = path.join(localesDir, `${lang}.ts`);
    const record: Record<string, string> = {};

    if (isStandard && fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const entryRegex = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
        let match;
        while ((match = entryRegex.exec(content)) !== null) {
          record[match[1]] = match[2];
        }
      } catch (err) {
        console.error(`[API LOCALES] Error reading locale file ${lang}.ts:`, err);
      }
    }

    if (lang !== 'en') {
      try {
        const { data: paramData } = await supabaseAdmin
          .from('system_parameters')
          .select('value')
          .eq('key', `ui_strings_${lang.toUpperCase()}`)
          .single();
        if (paramData?.value) {
          const dbRecord = JSON.parse(paramData.value);
          Object.assign(record, dbRecord);
        }
      } catch (err) {
        console.warn(`[API LOCALES] No existing system_parameters found for key ui_strings_${lang.toUpperCase()}`);
      }
    }

    if (oldNameEN && record[oldNameEN] !== undefined) {
      delete record[oldNameEN];
    }
    if (oldDescEN && record[oldDescEN] !== undefined) {
      delete record[oldDescEN];
    }

    for (const oldKey of oldCodeKeys) {
      if (record[oldKey] !== undefined) {
        delete record[oldKey];
      }
    }

    const draftRecord = draftTranslations[lang] || {};

    if (draftRecord[newNameEN] !== undefined) {
      record[newNameEN] = draftRecord[newNameEN];
    } else {
      if (lang === 'en') {
        record[newNameEN] = newNameEN;
      } else {
        const directName = lang === 'fr' ? catalogInfo.draft.nameFR : null;
        record[newNameEN] = directName || await translateText(newNameEN, lang);
      }
    }

    if (draftRecord[newDescEN] !== undefined) {
      record[newDescEN] = draftRecord[newDescEN];
    } else {
      if (lang === 'en') {
        record[newDescEN] = newDescEN;
      } else {
        const directDesc = lang === 'fr' ? catalogInfo.draft.descFR : null;
        record[newDescEN] = directDesc || await translateText(newDescEN, lang);
      }
    }

    for (const newKey of newCodeKeys) {
      if (draftRecord[newKey] !== undefined) {
        record[newKey] = draftRecord[newKey];
      } else {
        if (lang === 'en') {
          record[newKey] = newKey;
        } else {
          record[newKey] = await translateText(newKey, lang);
        }
      }
    }

    if (isStandard) {
      try {
        let output = 'export const locale: Record<string, string> = {\n';
        for (const [k, v] of Object.entries(record)) {
          output += `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`;
        }
        output += '};\n';
        fs.writeFileSync(filePath, output, 'utf8');
        console.log(`[API LOCALES] Committed pre-cached ${lang}.ts translations for "${newNameEN}"`);
      } catch (err) {
        console.error(`[API LOCALES] Error committing locale file ${lang}.ts:`, err);
      }
    }

    if (lang !== 'en') {
      try {
        const { error: upsertError } = await supabaseAdmin
          .from('system_parameters')
          .upsert({
            key: `ui_strings_${lang.toUpperCase()}`,
            value: JSON.stringify(record),
            updated_at: new Date().toISOString()
          });
        if (upsertError) {
          console.error(`[API LOCALES] Error upserting ui_strings_${lang.toUpperCase()} to database:`, upsertError.message);
        } else {
          console.log(`[API LOCALES] Committed database ui_strings_${lang.toUpperCase()} translations for "${newNameEN}"`);
        }
      } catch (err) {
        console.error(`[API LOCALES] Error committing database system_parameters for language ${lang}:`, err);
      }
    }
  }
}
