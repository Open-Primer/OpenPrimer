import Link from 'next/link';
import { GraduationCap, ArrowRight, BookOpen, Cpu, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-32 pb-24 px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8">
            <Cpu className="w-4 h-4" /> Propulsé par l'Intelligence Artificielle
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black mb-8 tracking-tight leading-[0.9]">
            Le Savoir Universel <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400">
              Enfin Libre.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            OpenPrimer est le premier projet open-source visant à synthétiser l'intégralité des cursus de la L1 à la L3 en un manuel interactif et gratuit.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/L1/Biology/Cell_Biology/introduction_to_the_cell"
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 group"
            >
              Commencer l'apprentissage <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-lg transition-all">
              Contribuer sur GitHub
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto py-24 px-8 grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <BookOpen className="w-12 h-12 text-emerald-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Cours Interactifs</h3>
          <p className="text-slate-400 leading-relaxed">Des contenus MDX riches avec des quiz, des simulations et des schémas générés à la volée.</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <Globe className="w-12 h-12 text-blue-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Standard Mondial</h3>
          <p className="text-slate-400 leading-relaxed">Une synthèse des meilleurs syllabus internationaux (MIT, Sorbonne, Stanford) en un tronc commun.</p>
        </div>
        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl">
          <Cpu className="w-12 h-12 text-violet-400 mb-6" />
          <h3 className="text-2xl font-bold mb-4">Tuteur IA</h3>
          <p className="text-slate-400 leading-relaxed">Une assistance personnalisée qui répond à vos questions en fonction du contexte du cours.</p>
        </div>
      </div>
    </div>
  );
}
