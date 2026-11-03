import React from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle } from 'lucide-react';
import { HEALTH_STRINGS } from './healthStrings';

interface HotSwapApiKeysPanelProps {
  t: typeof HEALTH_STRINGS.EN;
  keysForm: any;
  setKeysForm: any;
  showKeys: any;
  toggleShowKey: any;
  saveStatus: any;
  handleSaveKeys: any;
}

export const HotSwapApiKeysPanel: React.FC<HotSwapApiKeysPanelProps> = ({
  t,
  keysForm,
  setKeysForm,
  showKeys,
  toggleShowKey,
  saveStatus,
  handleSaveKeys
}) => {
  return (
        {/* Hot-Swap API Keys Configurator Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 border border-slate-800 hover:border-blue-500/20 rounded-[32px] bg-slate-900/30 flex flex-col gap-6"
        >
          <div>
            <h2 className="text-lg font-black text-white">{currentCfg.cfg_title}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{currentCfg.cfg_desc}</p>
          </div>

          {notif && (
            <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-blue-400 text-xs font-black uppercase tracking-widest">
              {notif}
            </div>
          )}

          <form onSubmit={handleSaveKeys} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_url}</label>
              <input
                type="text"
                autoComplete="new-password"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="w-full bg-slate-955 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_key}</label>
              <div className="relative">
                <input
                  type={showSbKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={supabaseAnonKey}
                  onChange={e => setSupabaseAnonKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowSbKey(!showSbKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showSbKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_resend}</label>
              <div className="relative">
                <input
                  type={showResendKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={resendApiKey}
                  onChange={e => setResendApiKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowResendKey(!showResendKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showResendKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_gemini}</label>
              <p className="text-[10px] text-slate-500 leading-snug">{currentCfg.lbl_gemini_help}</p>
              <div className="relative">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  placeholder={geminiApiKey && geminiApiKey.trim().startsWith('{') ? "Service Account JSON loaded..." : "••••••••••••••••••••••••••••"}
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <label className="text-[9px] font-bold text-slate-500 hover:text-white transition-colors cursor-pointer bg-slate-800/60 border border-slate-750 rounded-lg px-2.5 py-1.5 active:scale-[0.98]">
                  <span>Upload Service Account JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          try {
                            JSON.parse(text);
                            setGeminiApiKey(text);
                            setShowGeminiKey(false);
                          } catch (err) {
                            alert("Invalid JSON file!");
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                {geminiApiKey && geminiApiKey.trim().startsWith('{') && (
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded-lg">
                    JSON Key Loaded
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_smithsonian || 'Smithsonian API Key'}</label>
              <div className="relative">
                <input
                  type={showSmithsonianKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={smithsonianApiKey}
                  onChange={e => setSmithsonianApiKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowSmithsonianKey(!showSmithsonianKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showSmithsonianKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_unsplash || 'Unsplash Access Key'}</label>
              <div className="relative">
                <input
                  type={showUnsplashKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={unsplashApiKey}
                  onChange={e => setUnsplashApiKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowUnsplashKey(!showUnsplashKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showUnsplashKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 px-6 py-4.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98]"
              >
                {currentCfg.btn_apply}
              </button>
              <button
                type="button"
                onClick={handleResetKeys}
                className="px-6 py-4.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]"
              >
                {currentCfg.btn_reset}
              </button>
            </div>
          </form>
        </motion.div>


  );
};
