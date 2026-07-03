"use client";

import React from 'react';
import { Briefcase, TrendingUp, Compass, Landmark } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CareerProfileProps {
  profession: string;
  discipline: string;
  courseConnection: string;
  keyMissions: string[];
  careerOutlook: {
    demand: string;
    typicalEmployers: string[];
    salaryIndication: string;
  };
}

export const CareerProfile = ({
  profession,
  discipline,
  courseConnection,
  keyMissions,
  careerOutlook
}: CareerProfileProps) => {
  const { language } = useLanguage();

  const labels: Record<string, {
    header: string;
    courseLink: string;
    missions: string;
    outlook: string;
    demandLabel: string;
    employersLabel: string;
    salaryLabel: string;
    warningText: string;
  }> = {
    fr: {
      header: "Focus Carrière & Débouchés",
      courseLink: "Lien avec ce cours",
      missions: "Missions Principales",
      outlook: "Perspectives Économiques & Salaires",
      demandLabel: "Demande du marché",
      employersLabel: "Employeurs typiques",
      salaryLabel: "Rémunération indicative",
      warningText: "Les salaires et l'accessibilité aux postes varient fortement selon le pays, le niveau de diplôme académique et les financements régionaux."
    },
    en: {
      header: "Career Focus & Opportunities",
      courseLink: "Link to this course",
      missions: "Key Responsibilities",
      outlook: "Economic Outlook & Salaries",
      demandLabel: "Market demand",
      employersLabel: "Typical employers",
      salaryLabel: "Indicative salary",
      warningText: "Salaries and job accessibility vary significantly by country, level of academic degree, and regional funding."
    },
    es: {
      header: "Enfoque Profesional y Salidas",
      courseLink: "Enlace con este curso",
      missions: "Misiones Principales",
      outlook: "Perspectivas Económicas y Salarios",
      demandLabel: "Demanda del mercado",
      employersLabel: "Empleadores típicos",
      salaryLabel: "Remuneración indicativa",
      warningText: "Los salarios y la accesibilidad al empleo varían significativamente según el país, el nivel académico y la financiación regional."
    },
    de: {
      header: "Karrierefokus & Chancen",
      courseLink: "Verbindung zu diesem Kurs",
      missions: "Hauptaufgaben",
      outlook: "Wirtschaftlicher Ausblick & Gehälter",
      demandLabel: "Marktnachfrage",
      employersLabel: "Typische Arbeitgeber",
      salaryLabel: "Ungefähres Gehalt",
      warningText: "Gehälter und Erreichbarkeit von Stellen variieren stark je nach Land, akademischem Abschluss und regionaler Förderung."
    },
    zh: {
      header: "职业焦点与机遇",
      courseLink: "与本课程的联系",
      missions: "主要职责",
      outlook: "经济前景与薪资",
      demandLabel: "市场需求",
      employersLabel: "典型雇主",
      salaryLabel: "参考薪资",
      warningText: "薪资和职位的获取因国家、学历水平和地区资金而异。"
    }
  };

  const normalizedLang = (language || 'en').toLowerCase().split('-')[0];
  const curLabel = labels[normalizedLang] || labels['en'];

  return (
    <div className="my-6 p-6 bg-gradient-to-br from-teal-500/[0.04] to-cyan-500/[0.01] border-l-4 border-l-teal-500 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.005] transition-all duration-300">
      <div className="flex items-center justify-between border-b border-teal-500/10 pb-4 mb-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
              {curLabel.header}
            </span>
            <h4 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">
              {profession}
            </h4>
          </div>
        </div>
        <span className="text-[11px] font-semibold bg-teal-500/10 text-teal-700 dark:text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/20">
          {discipline}
        </span>
      </div>

      <div className="space-y-4 text-[13px] text-slate-700 dark:text-slate-350">
        <div>
          <h5 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5 mb-1.5 text-[13.5px]">
            <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" /> {curLabel.courseLink}
          </h5>
          <p className="pl-5 leading-relaxed italic">{courseConnection}</p>
        </div>

        <div>
          <h5 className="font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5 mb-2 text-[13.5px]">
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" /> {curLabel.missions}
          </h5>
          <ul className="list-disc pl-9 space-y-1.5 leading-relaxed">
            {keyMissions.map((mission, i) => (
              <li key={i}>{mission}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-100/50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mt-2">
          <h5 className="font-bold text-slate-900 dark:text-slate-200 flex items-center gap-1.5 mb-2 text-[13px]">
            <Landmark className="w-4 h-4 text-slate-500 dark:text-slate-400" /> {curLabel.outlook}
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{curLabel.demandLabel}</p>
              <p className="font-medium text-slate-800 dark:text-slate-300 mt-0.5">{careerOutlook.demand}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{curLabel.employersLabel}</p>
              <p className="font-medium text-slate-800 dark:text-slate-300 mt-0.5">
                {Array.isArray(careerOutlook.typicalEmployers) ? careerOutlook.typicalEmployers.join(', ') : careerOutlook.typicalEmployers}
              </p>
            </div>
            <div className="md:col-span-2 border-t border-slate-200 dark:border-slate-700/50 pt-2.5 mt-1">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">{curLabel.salaryLabel}</p>
              <p className="font-medium text-slate-800 dark:text-slate-300 mt-0.5">{careerOutlook.salaryIndication}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-2 leading-relaxed">
                ⚠️ {curLabel.warningText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
