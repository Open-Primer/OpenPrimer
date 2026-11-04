"use client";

import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import {
  CATEGORY_LOCALIZATIONS,
  PRESET_LOCALIZATIONS,
  MATH_PRESETS
} from './presets';

export interface PresetsCatalogProps {
  yMinVal?: number;
  yMaxVal?: number;
  textTitleColor: string;
  getUiString: (key: string) => string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: 'All' | 'Probability & Stats' | 'Waves & Signal' | 'Analysis & Growth';
  setSelectedCategory: (cat: 'All' | 'Probability & Stats' | 'Waves & Signal' | 'Analysis & Growth') => void;
  langKey: string;
  plottedExpression: string;
  setPlottedExpression: (expr: string) => void;
  setExpressionInput: (expr: string) => void;
  setIsValidExpr: (valid: boolean) => void;
  setXMinVal: (val: number) => void;
  setXMaxVal: (val: number) => void;
  setYMinVal: (val: number) => void;
  setYMaxVal: (val: number) => void;
}

export const PresetsCatalog: React.FC<PresetsCatalogProps> = ({
  textTitleColor,
  getUiString,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  langKey,
  plottedExpression,
  setPlottedExpression,
  setExpressionInput,
  setIsValidExpr,
  setXMinVal,
  setXMaxVal,
  setYMinVal,
  setYMaxVal,
}) => {
  return (
    <div className="border-t border-slate-800/40 pt-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h5 className={`text-xs font-black uppercase tracking-wider ${textTitleColor} flex items-center gap-1.5`}>
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>{getUiString('functions_catalog_title')}</span>
          </h5>
          <p className="text-[10px] font-bold text-slate-400">
            {getUiString('functions_catalog_desc')}
          </p>
        </div>
        
        {/* Real-time search query filter */}
        <div className="relative w-full sm:w-60">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder={getUiString('search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Premium category tabs */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Probability & Stats', 'Waves & Signal', 'Analysis & Growth'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-extrabold shadow-md'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {CATEGORY_LOCALIZATIONS[cat]?.[langKey] || CATEGORY_LOCALIZATIONS[cat]?.EN || cat}
          </button>
        ))}
      </div>

      {/* Interactive cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MATH_PRESETS.filter((preset) => {
          const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;
          
          const presetLoc = PRESET_LOCALIZATIONS[preset.id]?.[langKey] || PRESET_LOCALIZATIONS[preset.id]?.EN;
          const localizedName = presetLoc?.name || preset.name;
          const localizedDescription = presetLoc?.description || preset.description;
          const localizedCategory = CATEGORY_LOCALIZATIONS[preset.category]?.[langKey] || CATEGORY_LOCALIZATIONS[preset.category]?.EN || preset.category;

          const matchesSearch = localizedName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                preset.formula.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                localizedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                localizedCategory.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        }).map((preset) => {
          const isSelected = plottedExpression === preset.formula;
          
          const presetLoc = PRESET_LOCALIZATIONS[preset.id]?.[langKey] || PRESET_LOCALIZATIONS[preset.id]?.EN;
          const localizedName = presetLoc?.name || preset.name;
          const localizedDescription = presetLoc?.description || preset.description;
          const localizedCategory = CATEGORY_LOCALIZATIONS[preset.category]?.[langKey] || CATEGORY_LOCALIZATIONS[preset.category]?.EN || preset.category;

          return (
            <div
              key={preset.id}
              onClick={() => {
                setPlottedExpression(preset.formula);
                setExpressionInput(preset.formula);
                setIsValidExpr(true);
                setXMinVal(preset.xMin);
                setXMaxVal(preset.xMax);
                setYMinVal(preset.yMin);
                setYMaxVal(preset.yMax);
              }}
              className={`group rounded-2xl border p-4 space-y-3 cursor-pointer select-none transition-all duration-350 backdrop-blur-md ${
                isSelected
                  ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/5'
                  : 'bg-slate-950/20 border-slate-800 hover:border-slate-700 hover:bg-slate-950/40'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[10px] font-black tracking-tight ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
                  {localizedName}
                </span>
                <span className="text-[7px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60 border border-slate-800 shrink-0 px-2 py-0.5 rounded-full">
                  {localizedCategory}
                </span>
              </div>
              
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-[9px] font-black text-center text-indigo-300 group-hover:text-indigo-200 truncate">
                {preset.formula}
              </div>
              
              <p className="text-[9px] leading-relaxed text-slate-400 group-hover:text-slate-300 line-clamp-3">
                {localizedDescription}
              </p>
              
              <div className="flex justify-between text-[8px] font-bold text-slate-500 pt-2 border-t border-slate-900/60 font-mono">
                <span>X: [{preset.xMin}, {preset.xMax}]</span>
                <span>Y: [{preset.yMin}, {preset.yMax}]</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
