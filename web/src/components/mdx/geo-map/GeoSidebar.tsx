import React from 'react';
import { Compass, Globe, Award, TrendingUp, Users, CloudRain } from 'lucide-react';
import { ClimographView } from './ClimographView';
import { WEATHER_STATIONS, QuizQuestion } from './geoData';

interface SidebarProps {
  mode: 'explore' | 'quiz';
  t: any;
  inspectedData: any;
  quizStarted: boolean;
  isQuizComplete: boolean;
  currentQuestion: QuizQuestion;
  quizScore: number;
  xpEarned: number;
  showFeedback: 'correct' | 'incorrect' | null;
  handleStartQuiz: () => void;
  handleNextQuestion: () => void;
}

export const GeoSidebar: React.FC<SidebarProps> = ({
  mode,
  t,
  inspectedData,
  quizStarted,
  isQuizComplete,
  currentQuestion,
  quizScore,
  xpEarned,
  showFeedback,
  handleStartQuiz,
  handleNextQuestion
}) => {
  return (
    <div className="lg:col-span-4 h-full flex flex-col justify-between">
          {/* Mode Explore Panel */}
          {mode === 'explore' ? (
            <div className="flex flex-col h-full bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 min-h-[300px]">
              
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {t.inspector.title}
                </span>
              </div>

              {!inspectedData ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <Globe className="w-10 h-10 text-slate-600 mb-3 animate-pulse" />
                  <p className="text-xs text-slate-400 leading-normal font-medium">
                    {t.inspector.clickPrompt}
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-xs font-black text-white">{inspectedData.title}</span>
                    </div>

                    {/* Metadata items */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-950/40 border border-slate-800/50 rounded-lg">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.coordinates}</span>
                        <span className="text-slate-200 font-mono font-bold block mt-0.5">{inspectedData.lat}, {inspectedData.lng}</span>
                      </div>
                      <div className="p-2 bg-slate-950/40 border border-slate-800/50 rounded-lg">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.elevation}</span>
                        <span className="text-slate-200 font-bold block mt-0.5">{inspectedData.elevation}</span>
                      </div>
                    </div>

                    <div className="p-2 bg-slate-950/40 border border-slate-800/50 rounded-lg text-[11px]">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.biome}</span>
                      <span className="text-indigo-300 font-bold block mt-0.5">{inspectedData.biome}</span>
                    </div>

                    {inspectedData.country && (
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-950/40 border border-slate-800/50 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.country}</span>
                          <span className="text-slate-200 block mt-0.5 font-bold truncate">{inspectedData.country}</span>
                        </div>
                        <div className="p-2 bg-slate-950/40 border border-slate-800/50 rounded-lg">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">{t.inspector.capital}</span>
                          <span className="text-slate-200 block mt-0.5 font-bold truncate">{inspectedData.capital}</span>
                        </div>
                      </div>
                    )}

                    {/* Description if present */}
                    {(() => {
                      const physObj = mapElements.physical.find(p => p.id === inspectedData.id);
                      const econObj = mapElements.economic.find(p => p.id === inspectedData.id);
                      const demoObj = mapElements.demographics.find(p => p.id === inspectedData.id);
                      const desc = physObj ? (langKey === 'FR' ? physObj.descFR : physObj.descEN) :
                                   econObj ? (langKey === 'FR' ? econObj.descFR : econObj.descEN) :
                                   demoObj ? (langKey === 'FR' ? demoObj.descFR : demoObj.descEN) : null;
                      if (!desc) return null;
                      return (
                        <p className="text-xs text-slate-400 leading-normal p-2.5 bg-slate-950/20 border border-slate-800/40 rounded-xl">
                          {desc}
                        </p>
                      );
                    })()}
                  </div>

                  {/* Climograph block if station active */}
                  {inspectedData.weatherStationId && WEATHER_STATIONS[inspectedData.weatherStationId] && (
                    renderClimograph(WEATHER_STATIONS[inspectedData.weatherStationId])
                  )}
                </div>
              )}
            </div>
          ) : (
            
            // Mode Blank Map Quiz Panel
            <div className="flex flex-col h-full bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4 min-h-[300px]">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {t.quizMode}
                </span>
              </div>

              {!quizStarted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <Map className="w-12 h-12 text-slate-600 mb-3" />
                  <button
                    onClick={handleStartQuiz}
                    className="w-full py-2.5 px-4 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-wider"
                  >
                    {t.quiz.startBtn}
                  </button>
                </div>
              ) : isQuizComplete ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-full flex items-center justify-center mb-3">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-black text-white mb-1">
                    {t.quiz.successTitle}
                  </h4>
                  <p className="text-xs text-slate-400 leading-normal mb-4">
                    {t.quiz.successDesc}
                  </p>
                  
                  <div className="w-full bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl flex justify-between items-center mb-4">
                    <span className="text-xs text-slate-350">{t.quiz.score} : {quizScore} / {QUIZ_QUESTIONS.length}</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">+{xpEarned} XP</span>
                  </div>

                  <button
                    onClick={handleStartQuiz}
                    className="w-full py-2 px-4 bg-slate-800 text-white font-bold text-xs rounded-lg hover:bg-slate-700 transition-colors uppercase tracking-wider"
                  >
                    {langKey === 'FR' ? "Recommencer" : "Restart"}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between animate-fade-in">
                  <div className="flex flex-col gap-3">
                    
                    {/* Score Bar */}
                    <div className="flex justify-between text-xs text-slate-400 font-bold border-b border-slate-800 pb-2">
                      <span>{t.quiz.score} : {quizScore} / {QUIZ_QUESTIONS.length}</span>
                      <span className="text-indigo-400 font-mono">{xpEarned} XP</span>
                    </div>

                    {/* Question Box */}
                    <div className="p-3 bg-slate-900/60 border border-indigo-500/20 rounded-xl relative overflow-hidden">
                      <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider block mb-1">
                        {t.quiz.questionPrompt}
                      </span>
                      <span className="text-xs font-black text-white block">
                        {langKey === 'FR' ? currentQuestion.labelFR : currentQuestion.labelEN}
                      </span>
                    </div>

                    {/* Hint Drawer */}
                    <div className="p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl text-[10px] text-slate-450 leading-normal">
                      <span className="font-bold text-slate-400 block mb-1">💡 {t.quiz.hint} :</span>
                      {langKey === 'FR' ? currentQuestion.hintFR : currentQuestion.hintEN}
                    </div>

                    {/* Feedback overlays */}
                    {showFeedback && (
                      <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        showFeedback === 'correct'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        <span className="text-xs font-black">
                          {showFeedback === 'correct' ? `✓ ${t.quiz.correct}` : `✗ ${t.quiz.incorrect}`}
                        </span>
                      </div>
                    )}

                  </div>

                  {/* Manual Skip Option */}
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg hover:text-white hover:bg-slate-900 text-[10px] font-bold uppercase transition-colors mt-4"
                  >
                    {langKey === 'FR' ? "Passer l'élément" : "Skip Asset"}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

    </div>
  );
};
