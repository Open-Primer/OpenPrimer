import React from 'react';

interface DrawerProps {
  progress: number;
  t: any;
}

export const DrawEnzyme: React.FC<DrawerProps> = ({ progress, t }) => {
    const p = progress / 100;

    let sub1X = 280;
    let sub1Y = 120;
    let sub2X = 280;
    let sub2Y = 100;
    let enzymeGlow = "rgba(16,185,129,0)";

    if (p < 0.5) {
      const ratio = p / 0.5;
      sub1X = 280 - ratio * 100;
      sub2X = 280 - ratio * 100;
      sub1Y = 115 - ratio * 5;
      sub2Y = 85 + ratio * 5;
    } else if (p < 0.65) {
      sub1X = 180;
      sub2X = 180;
      sub1Y = 110;
      sub2Y = 90;
      const ratio = (p - 0.5) / 0.15;
      enzymeGlow = `rgba(16,185,129,${ratio * 0.45})`;
    } else {
      const ratio = (p - 0.65) / 0.35;
      sub1X = 180 - ratio * 110;
      sub2X = 180 - ratio * 110;
      sub1Y = 110 + ratio * 45;
      sub2Y = 90 - ratio * 45;
      enzymeGlow = `rgba(16,185,129,${Math.max(0, 0.45 - ratio * 0.45)})`;
    }

    return (
      <svg viewBox="0 0 400 220" className="w-full h-auto max-h-[260px] bg-slate-950/20 border border-slate-900 rounded-2xl overflow-visible p-2">
        <defs>
          <filter id="active-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx={170} cy={110} r="45" fill={enzymeGlow} filter="url(#active-glow)" className="transition-all duration-300" />

        <path
          d="M 120 110 C 120 60, 170 50, 170 80 Q 170 95, 185 95 Q 170 110, 185 110 Q 170 125, 185 125 Q 170 140, 170 140 C 170 170, 120 160, 120 110 Z"
          fill="#1e1b4b"
          stroke="#818cf8"
          strokeWidth="3"
        />
        <text x={140} y={114} fill="#818cf8" fontSize="10" fontWeight="900" textAnchor="middle" className="uppercase tracking-widest">{t["Enzyme"] || "Enzyme"}</text>

        {p < 0.65 ? (
          <g>
            <path
              d={`M ${sub1X} ${sub2Y} L ${sub1X + 15} ${sub2Y} L ${sub1X + 15} ${sub1Y + 15} L ${sub1X} ${sub1Y + 15} Q ${sub1X - 8} ${sub1Y + 5}, ${sub1X} ${sub2Y} Z`}
              fill="#ec4899"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            <text x={sub1X + 8} y={(sub1Y + sub2Y) / 2 + 4} fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">{t["Substrate"] || "Substrate"}</text>
          </g>
        ) : (
          <g>
            <path
              d={`M ${sub2X} ${sub2Y} L ${sub2X + 15} ${sub2Y} L ${sub2X + 15} ${sub2Y + 18} L ${sub2X} ${sub2Y + 18} Z`}
              fill="#fb7185"
              stroke="#fda4af"
              strokeWidth="1.5"
            />
            <text x={sub2X + 7} y={sub2Y + 12} fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">{t["P1"] || "P1"}</text>

            <path
              d={`M ${sub1X} ${sub1Y} L ${sub1X + 15} ${sub1Y} L ${sub1X + 15} ${sub1Y + 18} L ${sub1X} ${sub1Y + 18} Z`}
              fill="#38bdf8"
              stroke="#7dd3fc"
              strokeWidth="1.5"
            />
            <text x={sub1X + 7} y={sub1Y + 12} fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle">{t["P2"] || "P2"}</text>
          </g>
        )}
      </svg>
    );
  };


};
