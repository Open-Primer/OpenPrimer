"use client";

import { DataChart } from '@/components/mdx/DataChart';

export default function TestPage() {
  const testData = [
    {"label": "Cours en ligne", "value": 45},
    {"label": "Lectures", "value": 25},
    {"label": "Travaux pratiques", "value": 20},
    {"label": "Discussions de groupe", "value": 10}
  ];

  return (
    <div className="p-10 bg-slate-950 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-5">DataChart Test Page</h1>
      <div className="max-w-xl bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <DataChart 
          title="Répartition des méthodes d'apprentissage préférées" 
          type="donut" 
          unit="%" 
          data={testData} 
        />
      </div>
    </div>
  );
}
