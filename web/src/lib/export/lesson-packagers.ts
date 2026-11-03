/**
 * OpenPrimer - Lesson Packaging & Export Engine
 *
 * Provides document generators for Revision Sheets (MD & HTML), LMS Packages (SCORM 1.2,
 * Common Cartridge / LTI), standalone HTML, JSON AST, and ZIP binary synthesis.
 */

import { ExportStrings } from '@/components/export/strings';

export interface LessonExportOptions {
  content: string;
  title: string;
  courseSlug: string;
  lessonSlug: string;
  lang: string;
  level?: string;
  subject?: string;
  t: ExportStrings;
  getPremiumStyles: () => string;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function getExportFilename(courseSlug: string, lessonSlug: string, type: string, ext: string): string {
  const c = courseSlug || 'course';
  const l = lessonSlug || 'lesson';
  return `${c}-${l}-${type}.${ext}`;
}

export const generateSimpleZip = (files: { name: string; content: string }[]) => {
    const encoder = new TextEncoder();
    const fileDataList: any[] = [];
    let currentOffset = 0;
    const localHeaders: Uint8Array[] = [];

    for (const f of files) {
      const nameBytes = encoder.encode(f.name);
      const contentBytes = encoder.encode(f.content);
      
      const header = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(header.buffer);
      
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 10, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      
      let crc = 0xffffffff;
      for (let i = 0; i < contentBytes.length; i++) {
        crc ^= contentBytes[i];
        for (let j = 0; j < 8; j++) {
          crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
      }
      crc ^= 0xffffffff;
      
      view.setUint32(14, crc, true);
      view.setUint32(18, contentBytes.length, true);
      view.setUint32(22, contentBytes.length, true);
      view.setUint16(26, nameBytes.length, true);
      view.setUint16(28, 0, true);
      
      header.set(nameBytes, 30);
      
      localHeaders.push(header);
      localHeaders.push(contentBytes);
      
      fileDataList.push({ nameBytes, contentBytes, offset: currentOffset });
      currentOffset += header.length + contentBytes.length;
    }

    const centralHeaders: Uint8Array[] = [];
    let centralDirectorySize = 0;
    for (const f of fileDataList) {
      const header = new Uint8Array(46 + f.nameBytes.length);
      const view = new DataView(header.buffer);
      
      view.setUint32(0, 0x02014b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 10, true);
      view.setUint16(8, 0, true);
      view.setUint16(10, 0, true);
      view.setUint16(12, 0, true);
      view.setUint16(14, 0, true);
      
      let crc = 0xffffffff;
      for (let i = 0; i < f.contentBytes.length; i++) {
        crc ^= f.contentBytes[i];
        for (let j = 0; j < 8; j++) {
          crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
        }
      }
      crc ^= 0xffffffff;
      
      view.setUint32(16, crc, true);
      view.setUint32(20, f.contentBytes.length, true);
      view.setUint32(24, f.contentBytes.length, true);
      view.setUint16(28, f.nameBytes.length, true);
      view.setUint16(30, 0, true);
      view.setUint16(32, 0, true);
      view.setUint16(34, 0, true);
      view.setUint16(36, 0, true);
      view.setUint32(38, 0, true);
      view.setUint32(42, f.offset, true);
      
      header.set(f.nameBytes, 46);
      centralHeaders.push(header);
      centralDirectorySize += header.length;
    }

    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    eocdView.setUint32(0, 0x06054b50, true);
    eocdView.setUint16(4, 0, true);
    eocdView.setUint16(6, 0, true);
    eocdView.setUint16(8, fileDataList.length, true);
    eocdView.setUint16(10, fileDataList.length, true);
    eocdView.setUint32(12, centralDirectorySize, true);
    eocdView.setUint32(16, currentOffset, true);
    eocdView.setUint16(20, 0, true);

    const blobs = [...localHeaders, ...centralHeaders, eocd];
    return new Blob(blobs as any[], { type: 'application/zip' });
  };

  export const exportRevisionSheet = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, 'revision', 'md');
    
    // Parse Glossary terms
    const glossaryTerms: { term: string; definition: string }[] = [];
    const termRegex = /<Glossary\s+term="([^"]+)"\s+definition="([^"]+)"/g;
    let match: RegExpExecArray | null = null;
    while (true) {
      match = termRegex.exec(content);
      if (!match) break;
      const term = match[1];
      const definition = match[2];
      if (!glossaryTerms.some(item => item.term === term)) {
        glossaryTerms.push({ term, definition });
      }
    }

    // Extract Summary items (two formats: raw items=[...] or preprocessed itemsString="...")
    const summaryItems: string[] = [];
    // Format 1: items={["item1", "item2"]} (raw AI output)
    const summaryRegex = /<Summary\s+items={\[(.*?)\]}\s*\/>/gs;
    let summaryMatch: RegExpExecArray | null = null;
    while (true) {
      summaryMatch = summaryRegex.exec(content);
      if (!summaryMatch) break;
      const itemsStr = summaryMatch[1];
      const strRegex = /"([^"]+)"/g;
      let strMatch: RegExpExecArray | null = null;
      while (true) {
        strMatch = strRegex.exec(itemsStr);
        if (!strMatch) break;
        summaryItems.push(strMatch[1]);
      }
    }
    // Format 2: itemsString="item1|||item2" (after preprocessMdx)
    if (summaryItems.length === 0) {
      const summaryStrRegex = /<Summary\s+itemsString="([^"]+)"\s*\/>/g;
      let ssMatch: RegExpExecArray | null = null;
      while (true) {
        ssMatch = summaryStrRegex.exec(content);
        if (!ssMatch) break;
        ssMatch[1].split('|||').forEach(item => {
          const trimmed = item.trim();
          if (trimmed) summaryItems.push(trimmed);
        });
      }
    }

    // Extract Quiz questions (for self-testing)
    const quizQuestions: string[] = [];
    const qRegex = /<Question\s+q="([^"]+)"/g;
    let qMatch: RegExpExecArray | null = null;
    while (true) {
      qMatch = qRegex.exec(content);
      if (!qMatch) break;
      quizQuestions.push(qMatch[1]);
    }

    // Extract Tasks/Exercises
    const tasks: string[] = [];
    const taskRegex = /<Task[^>]*>([\s\S]*?)<\/Task>/g;
    while (true) {
      match = taskRegex.exec(content);
      if (!match) break;
      tasks.push(match[1].replace(/<[^>]+>/g, '').trim());
    }

    // Extract Tips and Ideas
    const tipsAndIdeas: { type: string; content: string }[] = [];
    const tipRegex = /<(Tip|Idea)[^>]*>([\s\S]*?)<\/\1>/g;
    let tMatch: RegExpExecArray | null = null;
    while (true) {
      tMatch = tipRegex.exec(content);
      if (!tMatch) break;
      const type = tMatch[1];
      const text = tMatch[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        tipsAndIdeas.push({ type, content: text });
      }
    }

    // Build Mindmap Mermaid structure
    let mermaidMindmap = `mindmap\n  root((${title}))\n`;
    if (glossaryTerms.length > 0) {
      mermaidMindmap += `    ${rt.concepts}\n`;
      glossaryTerms.slice(0, 10).forEach(item => {
        const cleanTerm = item.term.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, '');
        mermaidMindmap += `      ${cleanTerm}\n`;
      });
    }
    if (summaryItems.length > 0) {
      mermaidMindmap += `    ${rt.keyPoints}\n`;
      summaryItems.slice(0, 4).forEach((item, i) => {
        const shortLabel = item.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, '').substring(0, 40);
        mermaidMindmap += `      ${shortLabel}\n`;
      });
    }

    let revisionContent = `# ${rt.revisionSheet} : ${title}\n`;
    revisionContent += `**${rt.subject} :** ${subject} ÔÇó **${rt.level} :** ${level}\n`;
    revisionContent += `**${rt.generatedOn} :** ${new Date().toLocaleDateString()}\n\n`;

    revisionContent += `## ­ƒù║´©Å ${rt.mindMap}\n`;
    revisionContent += `\`\`\`mermaid\n${mermaidMindmap}\`\`\`\n\n`;

    if (summaryItems.length > 0) {
      revisionContent += `## ­ƒôØ ${rt.summary}\n`;
      revisionContent += summaryItems.map(item => `- ${item}`).join('\n');
      revisionContent += '\n\n';
    }

    revisionContent += `## ­ƒôÜ ${rt.glossary}\n`;
    revisionContent += glossaryTerms.length > 0
      ? glossaryTerms.map(item => `* **${item.term}** : ${item.definition}`).join('\n')
      : `*${rt.noGlossary}*`;
    revisionContent += '\n\n';

    if (tipsAndIdeas.length > 0) {
      revisionContent += `## ­ƒÆí ${rt.tipsAndInsights}\n`;
      revisionContent += tipsAndIdeas.map(item => `* **${item.type === 'Tip' ? rt.tip : rt.idea}** : ${item.content}`).join('\n');
      revisionContent += '\n\n';
    }

    if (quizQuestions.length > 0) {
      revisionContent += `## ­ƒºá ${rt.selfAssessment}\n`;
      revisionContent += quizQuestions.slice(0, 10).map((q, idx) => `${idx + 1}. ${q}`).join('\n');
      revisionContent += '\n\n';
    }

    if (tasks.length > 0) {
      revisionContent += `## ­ƒÄ» ${rt.exercises}\n`;
      revisionContent += tasks.map((t, idx) => `### ${rt.exercise} ${idx + 1}\n- ${t}`).join('\n\n');
      revisionContent += '\n';
    }

    revisionContent += `\n---\n*${rt.generatedBy}*`;

    const blob = new Blob([revisionContent], { type: 'text/markdown;charset=utf-8' });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url2);
    setDropdownOpen(false);
  };



  export const exportRevisionHtml = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, 'revision', 'html');

    // Parse Glossary terms
    const glossaryTerms: { term: string; definition: string }[] = [];
    const termRegex = /<Glossary\s+term="([^"]+)"\s+definition="([^"]+)"/g;
    let match: RegExpExecArray | null = null;
    while (true) {
      match = termRegex.exec(content);
      if (!match) break;
      if (!glossaryTerms.some(item => item.term === match![1]))
        glossaryTerms.push({ term: match[1], definition: match[2] });
    }

    // Extract Summary (two formats)
    const summaryItems: string[] = [];
    // Format 1: raw items={[...]}
    const summaryRegex = /<Summary\s+items={\[(.*?)\]}\s*\/>/gs;
    let sMatch: RegExpExecArray | null = null;
    while (true) {
      sMatch = summaryRegex.exec(content);
      if (!sMatch) break;
      const strRegex = /"([^"]+)"/g;
      let strMatch: RegExpExecArray | null = null;
      while (true) {
        strMatch = strRegex.exec(sMatch[1]);
        if (!strMatch) break;
        summaryItems.push(strMatch[1]);
      }
    }
    // Format 2: itemsString="..." (preprocessed)
    if (summaryItems.length === 0) {
      const summaryStrRegex = /<Summary\s+itemsString="([^"]+)"\s*\/>/g;
      let ssMatch: RegExpExecArray | null = null;
      while (true) {
        ssMatch = summaryStrRegex.exec(content);
        if (!ssMatch) break;
        ssMatch[1].split('|||').forEach(item => {
          const trimmed = item.trim();
          if (trimmed) summaryItems.push(trimmed);
        });
      }
    }

    // Extract Quiz questions
    const quizQuestions: string[] = [];
    const qRegex = /<Question\s+q="([^"]+)"/g;
    let qMatch: RegExpExecArray | null = null;
    while (true) {
      qMatch = qRegex.exec(content);
      if (!qMatch) break;
      quizQuestions.push(qMatch[1]);
    }

    // Extract Tasks/Exercises
    const tasks: string[] = [];
    const taskRegex = /<Task[^>]*>([\s\S]*?)<\/Task>/g;
    while (true) {
      match = taskRegex.exec(content);
      if (!match) break;
      tasks.push(match[1].replace(/<[^>]+>/g, '').trim());
    }

    // Extract Tips and Ideas
    const tipsAndIdeas: { type: string; content: string }[] = [];
    const tipRegex = /<(Tip|Idea)[^>]*>([\s\S]*?)<\/\1>/g;
    let tMatch: RegExpExecArray | null = null;
    while (true) {
      tMatch = tipRegex.exec(content);
      if (!tMatch) break;
      const type = tMatch[1];
      const text = tMatch[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        tipsAndIdeas.push({ type, content: text });
      }
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${rt.revisionSheet} ÔÇö ${title}</title>
  <style>
    ${getRevisionStyles()}
  </style>
</head>
<body>
  <header>
    <span class="badge">${subject} &bull; ${level}</span>
    <h1>${rt.revisionSheet}</h1>
    <p style="color: var(--text-muted); margin-top: 8px; font-size: 0.9rem;">${title}</p>
    <p style="color: var(--text-muted); font-size: 0.75rem;">
      ${rt.generatedOn} ${new Date().toLocaleDateString()}
      &nbsp;&bull;&nbsp; <span class="badge-ai">OpenPrimer AI</span>
    </p>
    <button class="print-btn no-print" onclick="window.print()">
      ­ƒû¿´©Å ${rt.printBtn}
    </button>
  </header>

  <main class="revision-grid">
    <div class="col-left">
      <!-- Section 1: Summary & Key Points -->
      ${summaryItems.length > 0 ? `
      <h2>­ƒôØ ${rt.summary}</h2>
      ${summaryItems.map(item => `<div class="key-point">${item}</div>`).join('')}
      ` : ''}

      <!-- Section 2: Exercises & Practice Tasks -->
      ${tasks.length > 0 ? `
      <h2>­ƒÄ» ${rt.exercises}</h2>
      ${tasks.map((t, idx) => `
        <div class="task-entry">
          <div class="task-title">${rt.exercise} ${idx + 1}</div>
          <div style="margin-top: 4px; line-height: 1.4;">${t}</div>
        </div>
      `).join('')}
      ` : ''}
    </div>

    <div class="col-right">
      <!-- Section 3: Glossary -->
      <h2>­ƒôÜ ${rt.glossary}</h2>
      ${glossaryTerms.length > 0
        ? glossaryTerms.map(item =>
            `<div class="glossary-entry"><strong>${item.term}</strong> : ${item.definition}</div>`
          ).join('')
        : `<div class="glossary-entry" style="font-style: italic; color: var(--text-muted); text-align: center;">${rt.noGlossary}</div>`
      }

      <!-- Section 4: Tips & Insights -->
      ${tipsAndIdeas.length > 0 ? `
      <h2>­ƒÆí ${rt.tipsAndInsights}</h2>
      ${tipsAndIdeas.map(item => `
        <div class="tip-entry">
          <strong>${item.type === 'Tip' ? rt.tip : rt.idea} :</strong> ${item.content}
        </div>
      `).join('')}
      ` : ''}

      <!-- Section 5: Self-Assessment Questions -->
      ${quizQuestions.length > 0 ? `
      <h2>­ƒºá ${rt.selfAssessment}</h2>
      ${quizQuestions.slice(0, 10).map((q, idx) =>
        `<div class="quiz-q"><strong>${idx + 1}.</strong> ${q}</div>`
      ).join('')}
      ` : ''}
    </div>
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url2 = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url2;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url2);
    setDropdownOpen(false);
  };



  export const exportMarkdown = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, '', 'md');
    const frontmatter = `---
title: "${title}"
subject: "${subject}"
level: "${level}"
lang: "${lang}"
---

${content}`;
    
    const blob = new Blob([frontmatter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };



  export const exportJson = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, '', 'json');
    const data = {
      title,
      subject,
      level,
      lang,
      exportedAt: new Date().toISOString(),
      format: "OpenPrimer course export",
      content
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };



  export const exportHtml = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, '', 'html');
    const renderedBody = convertMdxToHtml(content);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${getPremiumStyles()}
  </style>
</head>
<body>
  <header>
    <span class="badge">${subject} &bull; ${level}</span>
    <h1>${title}</h1>
  </header>
  <main>
    ${renderedBody}
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };



  export const exportScorm = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, 'scorm', 'zip');
    const renderedBody = convertMdxToHtml(content);

    const imsManifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="OpenPrimer_SCORM_Course" version="1.1"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="openprimer_org">
    <organization identifier="openprimer_org">
      <title>${title}</title>
      <item identifier="item_1" identifierref="resource_1">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
    </resource>
  </resources>
</manifest>`;

    const indexHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${getPremiumStyles()}
  </style>
  <script>
    // SCORM API Communication Wrapper
    var api = null;
    function getAPI() {
      if (api) return api;
      var win = window;
      while (win) {
        if (win.API) {
          api = win.API;
          break;
        }
        if (win.parent && win.parent !== win) {
          win = win.parent;
        } else {
          break;
        }
      }
      return api;
    }

    window.onload = function() {
      var scormApi = getAPI();
      if (scormApi) {
        scormApi.LMSInitialize("");
        scormApi.LMSSetValue("cmi.core.lesson_status", "completed");
        scormApi.LMSCommit("");
      }
    };

    window.onunload = function() {
      var scormApi = getAPI();
      if (scormApi) {
        scormApi.LMSFinish("");
      }
    };
  </script>
</head>
<body>
  <header>
    <span class="badge">${subject} &bull; ${level}</span>
    <h1>${title}</h1>
  </header>
  <main>
    ${renderedBody}
  </main>
</body>
</html>`;

    // Package as ZIP client-side
    const files = [
      { name: "imsmanifest.xml", content: imsManifestXml },
      { name: "index.html", content: indexHtml }
    ];

    const zipBlob = generateSimpleZip(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };



  export const exportLtiCartridge = (opts: LessonExportOptions) => {
    const { content, title, courseSlug, lessonSlug, lang, level, subject, t, getPremiumStyles } = opts;
    const filename = getExportFilename(courseSlug, lessonSlug, 'lti', 'imscc');
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://openprimer.ai';
    
    const imsManifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="OpenPrimer_LTI_Course_Cartridge" 
          xmlns="http://www.imsglobal.org/xsd/imscc/imscp_v1p1" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xsi:schemaLocation="http://www.imsglobal.org/xsd/imscc/imscp_v1p1 
                              https://purl.imsglobal.org/spec/cc/v1p1/schema/xsd/imscp_v1p1.xsd">
  <metadata>
    <schema>IMS Common Cartridge</schema>
    <schemaversion>1.2.0</schemaversion>
  </metadata>
  <organizations>
    <organization identifier="org_1" structure="rooted-hierarchy">
      <item identifier="item_1" identifierref="resource_lti_link">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="resource_lti_link" type="imsbasiclti_xmlv1p0">
      <file href="ltilink.xml"/>
    </resource>
  </resources>
</manifest>`;

    const ltiLinkXml = `<?xml version="1.0" encoding="UTF-8"?>
<cartridge_basiclti_link 
    xmlns="http://www.imsglobal.org/xsd/imslticc_v1p0"
    xmlns:blti="http://www.imsglobal.org/xsd/imsbasiclti_v1p0"
    xmlns:lticm="http://www.imsglobal.org/xsd/imslticm_v1p0"
    xmlns:lticp="http://www.imsglobal.org/xsd/imslticp_v1p0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.imsglobal.org/xsd/imslticc_v1p0 imslticc_v1p0p1.xsd 
                        http://www.imsglobal.org/xsd/imsbasiclti_v1p0 imsbasiclti_v1p0p1.xsd">
  <blti:title>${title}</blti:title>
  <blti:description>Course lesson: ${title} (${subject} - ${level})</blti:description>
  <blti:launch_url>${origin}/api/lti/launch</blti:launch_url>
  <blti:secure_launch_url>${origin}/api/lti/launch</blti:secure_launch_url>
  <blti:custom>
    <lticm:property name="course_slug">${courseSlug || ''}</lticm:property>
    <lticm:property name="subject">${subject}</lticm:property>
    <lticm:property name="level">${level}</lticm:property>
    <lticm:property name="lesson_title">${title}</lticm:property>
  </blti:custom>
  <blti:vendor>
    <lticp:code>openprimer.ai</lticp:code>
    <lticp:name>OpenPrimer</lticp:name>
  </blti:vendor>
</cartridge_basiclti_link>`;

    const files = [
      { name: "imsmanifest.xml", content: imsManifestXml },
      { name: "ltilink.xml", content: ltiLinkXml }
    ];

    const zipBlob = generateSimpleZip(files);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDropdownOpen(false);
  };

  // Minimal ZIP packaging utility (Standard DEFLATE-less ZIP)


