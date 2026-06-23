"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Copy, Check, Code, Terminal, ExternalLink } from 'lucide-react';

interface CodeSandboxProps {
  initialCode?: string;
  title?: string;
  language?: 'html' | 'javascript' | 'css';
  height?: string;
}

function injectSecureCSP(rawCode: string): string {
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; form-action 'none';">`;
  const trimmed = (rawCode || '').trim();

  if (/<head[^>]*>/i.test(trimmed)) {
    return trimmed.replace(/(<head[^>]*>)/i, `$1\n  ${cspMeta}`);
  } else if (/<html[^>]*>/i.test(trimmed)) {
    return trimmed.replace(/(<html[^>]*>)/i, `$1\n<head>\n  ${cspMeta}\n</head>`);
  } else {
    return `<!DOCTYPE html>
<html>
<head>
  ${cspMeta}
</head>
<body>
${trimmed}
</body>
</html>`;
  }
}

export function CodeSandbox({
  initialCode = `<!-- Modifiez ce code pour voir le résultat en temps réel ! -->
<div class="card">
  <h1>Bonjour OpenPrimer ! 🚀</h1>
  <p>Ceci est un bac à sable interactif en temps réel.</p>
  <button id="btn">Cliquez-moi !</button>
</div>

<style>
  body {
    font-family: 'Inter', system-ui, sans-serif;
    background: #0f172a;
    color: #f8fafc;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    margin: 0;
  }
  .card {
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.1);
    backdrop-filter: blur(12px);
    padding: 2.5rem;
    border-radius: 24px;
    text-align: center;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #34d399, #059669);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  p {
    color: #94a3b8;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  button {
    background: #10b981;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 1rem;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }
  button:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
  button:active {
    transform: translateY(0);
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>

<script>
  const button = document.getElementById('btn');
  button.addEventListener('click', () => {
    button.textContent = 'Magique ! 🎉';
    button.style.background = '#059669';
    
    // Créer une animation de confettis simple
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'];
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '50%';
      particle.style.left = '50%';
      particle.style.top = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(particle);
      
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 100;
        particle.style.left = \`calc(50% + \${Math.cos(angle) * radius}px)\`;
        particle.style.top = \`calc(50% + \${Math.sin(angle) * radius}px)\`;
        particle.style.opacity = '0';
        setTimeout(() => particle.remove(), 1000);
      }, 50);
    }
  });
</script>`,
  title = "Bac à Sable Interactif",
  language = "html",
  height = "420px"
}: CodeSandboxProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Synchronize on initialization or initialCode reset
  useEffect(() => {
    setCode(initialCode);
    setPreviewKey(prev => prev + 1);
  }, [initialCode]);

  const runCode = () => {
    setPreviewKey(prev => prev + 1);
  };

  const resetCode = () => {
    setCode(initialCode);
    setPreviewKey(prev => prev + 1);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy code: ', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enable tabs in textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      setCode(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="my-10 bg-slate-950 border border-slate-800/80 rounded-[28px] shadow-2xl overflow-hidden flex flex-col group/sandbox hover:border-slate-700/60 transition-colors duration-300">
      {/* Header Panel */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/60 border-b border-slate-800/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              Bac à Sable Client
            </span>
            <h4 className="text-sm font-bold text-slate-100">{title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Action buttons */}
          <button
            onClick={runCode}
            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/40 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            title="Exécuter le code"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Lancer
          </button>
          
          <button
            onClick={resetCode}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={copyCode}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
            title="Copier le code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Panel */}
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-900 text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-slate-500" />
              Éditeur de code
            </span>
            <span>{language.toUpperCase()}</span>
          </div>
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-4 bg-slate-950 text-slate-300 font-mono text-[13px] leading-relaxed resize-none outline-none focus:ring-0 select-text overflow-y-auto"
              style={{ height }}
              spellCheck={false}
              placeholder="Écrivez votre code ici..."
            />
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-900 text-[11px] font-bold text-slate-500 tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3 text-slate-500" />
              Aperçu en direct
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                🔒 Bac à sable sécurisé (CSP active)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="bg-slate-900 relative" style={{ height }}>
            <iframe
              key={previewKey}
              ref={iframeRef}
              srcDoc={injectSecureCSP(code)}
              title="Code Sandbox Preview"
              sandbox="allow-scripts"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
