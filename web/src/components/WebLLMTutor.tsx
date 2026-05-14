"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Download, Send, Zap, AlertTriangle } from 'lucide-react';

// Note: Requires npm install @mlc-ai/web-llm
// import * as webllm from "@mlc-ai/web-llm";

export const WebLLMTutor = () => {
  const [engine, setEngine] = useState<any>(null);
  const [status, setStatus] = useState("Modèle non chargé");
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const selectedModel = "Gemma-2b-it-q4f16_1-MLC"; // Efficient model for browser

  const loadModel = async () => {
    setIsDownloading(true);
    setStatus("Initialisation de WebGPU...");
    
    try {
      // In a real implementation:
      // const engine = await webllm.CreateWebWorkerEngine(new Worker(new URL("./worker.ts", import.meta.url)));
      // await engine.reload(selectedModel, (report) => {
      //   setProgress(Math.round(report.progress * 100));
      //   setStatus(report.text);
      // });
      // setEngine(engine);
      
      // Simulation for UI demo
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setProgress(p);
        setStatus(`Téléchargement du cerveau IA... ${p}%`);
        if (p >= 100) {
          clearInterval(interval);
          setStatus("IA prête localement");
          setIsDownloading(false);
          setEngine({ ready: true });
        }
      }, 100);

    } catch (err) {
      setStatus("Erreur: WebGPU non supporté sur ce navigateur");
      setIsDownloading(false);
    }
  };

  const handleSend = async () => {
    if (!input || !engine) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages([...newMessages, { role: "assistant", content: "Je suis votre tuteur local. Comment puis-je vous aider avec ce cours ?" }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-slate-950 border border-slate-800 rounded-[32px] shadow-2xl flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Tuteur Local</h3>
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3" /> Gratuit & Privé
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
        {!engine && !isDownloading ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-4 rounded-full bg-blue-600/10">
              <Download className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-white font-medium mb-2">Activer le tutorat gratuit</p>
              <p className="text-slate-500 text-xs px-4">
                Le tuteur tournera directement sur votre ordinateur. Un téléchargement unique de 1.2 Go est nécessaire.
              </p>
            </div>
            <button 
              onClick={loadModel}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
            >
              Télécharger le modèle
            </button>
          </div>
        ) : isDownloading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-600"
              />
            </div>
            <p className="text-slate-400 text-xs animate-pulse">{status}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!engine}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-slate-600 outline-none focus:border-blue-500 transition-all"
            placeholder="Posez votre question..."
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-400"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
