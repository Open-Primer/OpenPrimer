import { getDisciplineLabel } from '../../strings';

export const getDisciplineColor = (disc: string) => {
  const map: Record<string, string> = {
    Chemistry: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    Physics: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    Mathematics: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    Biology: 'bg-emerald-600/10 border-emerald-600/20 text-emerald-300',
    'Computer Science': 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
    Economics: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    'Social Sciences': 'bg-pink-500/10 border-pink-500/20 text-pink-400',
    General: 'bg-slate-500/10 border-slate-500/20 text-slate-400'
  };
  return map[disc] || 'bg-slate-500/10 border-slate-500/20 text-slate-400';
};

export const getDisciplinesSummary = (selected: string[], lang: string, tr: (k: string) => string) => {
  if (selected.length === 0) return tr("Select subject fields...");
  if (selected.length <= 2) {
    return selected.map(d => getDisciplineLabel(d, lang)).join(', ');
  }
  return tr("{count} subjects selected").replace("{count}", selected.length.toString());
};
