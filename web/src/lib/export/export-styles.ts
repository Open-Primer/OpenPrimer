/**
 * @file export-styles.ts
 * @description Standalone CSS styles generator for exported HTML lessons and SCORM packages.
 */

// Shared premium CSS design to make exported HTML look premium and wow the user
export const getPremiumStyles = () => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
      
      :root {
        --primary: #4f46e5;
        --primary-glow: rgba(79, 70, 229, 0.15);
        --bg-main: #0b0f19;
        --bg-card: #151d30;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border: #1e293b;
        --code-color: #f472b6;
        --pre-bg: #070a12;
      }

      @media (prefers-color-scheme: light) {
        :root {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --code-color: #db2777;
          --pre-bg: #f1f5f9;
          --primary-glow: rgba(79, 70, 229, 0.08);
        }
      }
      
      body {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background-color: var(--bg-main);
        color: var(--text-main);
        line-height: 1.8;
        max-width: 850px;
        margin: 0 auto;
        padding: 50px 24px;
        transition: background-color 0.3s, color 0.3s;
      }
      
      header {
        margin-bottom: 48px;
        border-bottom: 2px solid var(--border);
        padding-bottom: 32px;
      }
      
      .badge {
        display: inline-block;
        padding: 6px 14px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        background-color: var(--primary-glow);
        color: #818cf8;
        border: 1px solid rgba(79, 70, 229, 0.2);
        border-radius: 9999px;
        margin-bottom: 20px;
      }
      
      h1 {
        font-size: 2.75rem;
        font-weight: 800;
        line-height: 1.25;
        letter-spacing: -0.02em;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      h2 {
        font-size: 1.8rem;
        font-weight: 700;
        margin-top: 48px;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 12px;
        letter-spacing: -0.01em;
      }
      
      h3 {
        font-size: 1.35rem;
        font-weight: 600;
        margin-top: 36px;
        margin-bottom: 18px;
      }
      
      p {
        margin-top: 0;
        margin-bottom: 24px;
      }
      
      ul, ol {
        margin-top: 0;
        margin-bottom: 24px;
        padding-left: 28px;
      }
      
      li {
        margin-bottom: 10px;
      }
      
      code {
        font-family: 'Fira Code', monospace;
        font-size: 0.88em;
        background-color: var(--primary-glow);
        padding: 3px 8px;
        border-radius: 8px;
        color: var(--code-color);
        font-weight: 500;
      }
      
      pre {
        background-color: var(--pre-bg);
        border: 1px solid var(--border);
        padding: 24px;
        border-radius: 16px;
        overflow-x: auto;
        margin-bottom: 28px;
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
      }
      
      pre code {
        background-color: transparent;
        padding: 0;
        border-radius: 0;
        color: inherit;
        font-size: 0.9em;
      }
      
      blockquote {
        border-left: 4px solid var(--primary);
        background-color: var(--primary-glow);
        padding: 20px 28px;
        margin: 28px 0;
        border-radius: 4px 16px 16px 4px;
        font-style: italic;
      }

      .callout {
        padding: 24px;
        border-radius: 16px;
        margin-bottom: 28px;
        border: 1px solid var(--border);
        background-color: var(--bg-card);
        box-shadow: 0 4px 20px -5px rgba(0,0,0,0.15);
      }
      
      .callout-idea {
        border-left: 4px solid #f59e0b;
        background-color: rgba(245, 158, 11, 0.03);
      }
      
      .callout-tip {
        border-left: 4px solid #10b981;
        background-color: rgba(16, 185, 129, 0.03);
      }
      
      .callout-task {
        border-left: 4px solid #3b82f6;
        background-color: rgba(59, 130, 246, 0.03);
      }

      .callout-keypoint {
        border-left: 4px solid #8b5cf6;
        background-color: rgba(139, 92, 246, 0.03);
      }
      
      .glossary-term {
        border-bottom: 1px dashed var(--primary);
        cursor: help;
        color: #818cf8;
        position: relative;
        font-weight: 500;
        padding-bottom: 1px;
      }
      
      .glossary-term:hover {
        color: #a5b4fc;
      }
      
      .glossary-term::after {
        content: attr(title);
        position: absolute;
        bottom: 130%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #020617;
        color: #ffffff;
        padding: 10px 16px;
        border-radius: 10px;
        font-size: 0.82rem;
        font-weight: 400;
        width: 260px;
        white-space: normal;
        box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--border);
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        z-index: 10;
        line-height: 1.45;
      }
      
      .glossary-term:hover::after {
        visibility: visible;
        opacity: 1;
      }
    `;
  };

  const getRevisionStyles = () => {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
      
      :root {
        --primary: #4f46e5;
        --primary-glow: rgba(79, 70, 229, 0.1);
        --bg-main: #0b0f19;
        --bg-card: #151d30;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border: #1e293b;
      }

      @media (prefers-color-scheme: light) {
        :root {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --text-main: #0f172a;
          --text-muted: #475569;
          --border: #e2e8f0;
          --primary-glow: rgba(79, 70, 229, 0.05);
        }
      }
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: var(--bg-main);
        color: var(--text-main);
        line-height: 1.5;
        max-width: 1100px;
        margin: 0 auto;
        padding: 32px 24px;
        transition: background-color 0.3s, color 0.3s;
      }
      
      header {
        margin-bottom: 24px;
        border-bottom: 2px solid var(--border);
        padding-bottom: 16px;
        position: relative;
      }
      
      .badge {
        display: inline-block;
        padding: 4px 10px;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background-color: var(--primary-glow);
        color: #818cf8;
        border: 1px solid rgba(79, 70, 229, 0.2);
        border-radius: 9999px;
        margin-bottom: 12px;
      }
      
      h1 {
        font-family: 'Outfit', sans-serif;
        font-size: 2.25rem;
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin: 0;
        background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      h2 {
        font-family: 'Outfit', sans-serif;
        font-size: 1.35rem;
        font-weight: 700;
        margin-top: 24px;
        margin-bottom: 12px;
        border-bottom: 2px solid var(--border);
        padding-bottom: 6px;
        letter-spacing: -0.01em;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      h3 {
        font-family: 'Outfit', sans-serif;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 16px;
        margin-bottom: 8px;
      }
      
      p {
        margin-top: 0;
        margin-bottom: 12px;
      }

      .revision-grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 24px;
      }
      
      @media (max-width: 850px) {
        .revision-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
      }
      
      .key-point {
        padding: 10px 14px;
        border-left: 3px solid #4f46e5;
        background: var(--bg-card);
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        margin-bottom: 10px;
        font-size: 0.9rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      
      .glossary-entry {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      .glossary-entry strong {
        color: #818cf8;
      }

      .quiz-q {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border-left: 3px solid #10b981;
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .task-entry {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border-left: 3px solid #f59e0b;
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }

      .tip-entry {
        padding: 10px 14px;
        margin-bottom: 8px;
        background: var(--bg-card);
        border-left: 3px solid #8b5cf6;
        border-top: 1px solid var(--border);
        border-right: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        border-radius: 0 8px 8px 0;
        font-size: 0.88rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      
      .print-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 18px;
        background: #4f46e5;
        color: white;
        font-weight: 700;
        font-size: 0.8rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Outfit', sans-serif;
        letter-spacing: 0.04em;
        transition: background 0.2s;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      }
      .print-btn:hover {
        background: #4338ca;
      }
      
      .badge-ai {
        display: inline-block;
        padding: 2px 8px;
        font-size: 0.65rem;
        font-weight: 700;
        background: rgba(139,92,246,0.15);
        color: #a78bfa;
        border: 1px solid rgba(139,92,246,0.3);
        border-radius: 9999px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      @media print {
        body {
          background-color: #ffffff !important;
          color: #0f172a !important;
          padding: 0 !important;
          font-size: 9.5pt !important;
          line-height: 1.35 !important;
        }
        .revision-grid {
          grid-template-columns: 1.1fr 0.9fr !important;
          gap: 16pt !important;
        }
        .key-point, .glossary-entry, .quiz-q, .task-entry, .tip-entry {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
          page-break-inside: avoid !important;
          box-shadow: none !important;
        }
        .key-point strong, .glossary-entry strong {
          color: #0f172a !important;
        }
        h1 {
          font-size: 18pt !important;
        }
        h2 {
          font-size: 12pt !important;
          margin-top: 14pt !important;
          margin-bottom: 6pt !important;
          border-bottom-color: #cbd5e1 !important;
        }
        header {
          margin-bottom: 12pt !important;
          padding-bottom: 8pt !important;
          border-bottom-color: #cbd5e1 !important;
        }
        .no-print {
          display: none !important;
        }
        @page {
          size: landscape;
          margin: 10mm 12mm !important;
        }
      }
    `;
  };

  // Convert raw Markdown/MDX into high-fidelity formatted HTML
  const convertMdxToHtml = (mdx: string) => {
    // 1. Strip YAML frontmatter if it exists
    let body = mdx.replace(/^---[\s\S]*?---/, '');

    // 2. Parse Glossary tags
    body = body.replace(/<Glossary\s+term="([^"]+)"\s+definition="([^"]+)"(?:\s*\/|\s*>.*?<\/Glossary|)>?/g, (_, term, definition) => {
      return `<span class="glossary-term" title="${definition.replace(/"/g, '&quot;')}">${term}</span>`;
    });

    // 3. Convert callout tags (Idea, Tip, Task, KeyPoint)
    const containers = [
      { tag: 'Idea', icon: '­ƒÆí', title: rt.idea },
      { tag: 'Tip', icon: '­ƒÆí', title: rt.tip },
      { tag: 'Task', icon: '­ƒÄ»', title: rt.taskTitle },
      { tag: 'KeyPoint', icon: '­ƒöæ', title: rt.keyPointTitle }
    ];
    containers.forEach(({ tag, icon, title }) => {
      const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g');
      body = body.replace(regex, (_, content) => {
        return `<div class="callout callout-${tag.toLowerCase()}">${icon} <strong>${title} :</strong> ${content.trim()}</div>`;
      });
    });

    // Strip other custom React tag wrappers
    body = body.replace(/<[A-Z][a-zA-Z0-9]*[^>]*>/g, '');
    body = body.replace(/<\/[A-Z][a-zA-Z0-9]*>/g, '');

    // 4. Save Code Blocks to avoid escaping
    const codeBlocks: string[] = [];
    body = body.replace(/```(\w*)\n([\s\S]*?)```/gm, (_, lang, code) => {
      const idx = codeBlocks.length;
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      codeBlocks.push(`<pre><code class="language-${lang}">${escapedCode.trim()}</code></pre>`);
      return `__CODE_BLOCK_${idx}__`;
    });

    // 5. Escape general HTML but keep our generated HTML tags safe
    const htmlPlaceholders: string[] = [];
    const preserveRegex = /<\/?(span|div|strong|em|pre|code|blockquote|ul|ol|li)[^>]*>/gi;
    body = body.replace(preserveRegex, (match) => {
      const idx = htmlPlaceholders.length;
      htmlPlaceholders.push(match);
      return `__HTML_TAG_${idx}__`;
    });

    body = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    for (let i = 0; i < htmlPlaceholders.length; i++) {
      body = body.replace(`__HTML_TAG_${i}__`, htmlPlaceholders[i]);
    }

    // 6. Convert inline formatting
    body = body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    body = body.replace(/__(.*?)__/g, '<strong>$1</strong>');
    body = body.replace(/\*(.*?)\*/g, '<em>$1</em>');
    body = body.replace(/_([^_]+)_/g, '<em>$1</em>');
    body = body.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 7. Headers
    body = body.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    body = body.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    body = body.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 8. Blockquotes
    body = body.replace(/^\s*>\s*(.*$)/gim, '<blockquote>$1</blockquote>');

    // 9. Lists
    body = body.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li>$1</li>');
    body = body.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    body = body.replace(/<\/ul>\s*<ul>/g, '\n');

    // 10. Paragraph splits
    const blocks = body.split(/\n\s*\n/);
    body = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || 
          trimmed.startsWith('<pre') || 
          trimmed.startsWith('<ul') || 
          trimmed.startsWith('<ol') || 
          trimmed.startsWith('<div') || 
          trimmed.startsWith('<block')) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');

    // Restore Code Blocks
    for (let i = 0; i < codeBlocks.length; i++) {
      body = body.replace(`__CODE_BLOCK_${i}__`, codeBlocks[i]);
    }

    return body;
  };
