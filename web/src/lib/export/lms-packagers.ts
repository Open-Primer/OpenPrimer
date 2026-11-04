import { convertMdxToHtml } from './export-styles';
import { LessonExportOptions, getExportFilename, generateSimpleZip } from './lesson-packagers';

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
    // setDropdownOpen(false);
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
    // setDropdownOpen(false);
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
    // setDropdownOpen(false);
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
    // setDropdownOpen(false);
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
    // setDropdownOpen(false);
  };

  // Minimal ZIP packaging utility (Standard DEFLATE-less ZIP)


