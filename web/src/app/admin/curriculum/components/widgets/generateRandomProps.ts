import React from 'react';

export const generateRandomProps = (widgetId: string): Record<string, any> => {
    switch (widgetId) {
      case 'StructureViewer3D': {
        const presets = ["water", "nacl", "graphene", "co2", "ch4", "ethanol"];
        const presetId = presets[Math.floor(Math.random() * presets.length)];
        return { presetId };
      }
      case 'QuantumOrbitalExplorer': {
        const orbitals = ["1s", "2s", "2pz", "sp", "sp2", "sp3"];
        const levels = ["middle_school", "high_school", "university"];
        return {
          initialPresetId: orbitals[Math.floor(Math.random() * orbitals.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'DynamicSimulation': {
        const presets = ['mitosis', 'carnot', 'wave', 'double_slit', 'enzyme'];
        return { preset: presets[Math.floor(Math.random() * presets.length)] };
      }
      case 'ChemicalStoichiometry': {
        const equations = ["H2O", "CH4", "NH3", "C6H12O6"];
        return { reaction: equations[Math.floor(Math.random() * equations.length)] };
      }
      case 'BasicMathExplorer': {
        const tabs = ['add-sub', 'mul-div', 'fractions', 'parentheses'];
        const modes = ['add', 'sub', 'mul', 'div'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          initialTab: tabs[Math.floor(Math.random() * tabs.length)],
          initialMode: modes[Math.floor(Math.random() * modes.length)],
          initialNumA: Math.floor(Math.random() * 20) + 1,
          initialNumB: Math.floor(Math.random() * 10) + 1,
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'FunctionPlotter': {
        const modes = ['linear', 'compound-interest', 'supply-demand', 'expression'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          mode: modes[Math.floor(Math.random() * modes.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)],
          xMin: 0,
          xMax: Math.floor(Math.random() * 15) + 10
        };
      }
      case 'ComparisonSlider': {
        const layouts = ['clip', 'split'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          beforeLabel: tr("State A (Randomized)"),
          afterLabel: tr("State B (Randomized)"),
          beforeContent: React.createElement('div', { className: "w-full h-full flex flex-col items-center justify-center bg-blue-950/40 text-blue-400 p-8 border border-blue-900/20 rounded-2xl gap-2 min-h-[200px]" }, React.createElement('span', { className: "text-xl" }, "📊"), React.createElement('span', { className: "font-bold text-xs uppercase tracking-wide" }, tr("Spectroscopy Phase A"))),
          afterContent: React.createElement('div', { className: "w-full h-full flex flex-col items-center justify-center bg-emerald-950/40 text-emerald-400 p-8 border border-emerald-900/20 rounded-2xl gap-2 min-h-[200px]" }, React.createElement('span', { className: "text-xl" }, "📈"), React.createElement('span', { className: "font-bold text-xs uppercase tracking-wide" }, tr("Spectroscopy Phase B"))),
          layout: layouts[Math.floor(Math.random() * layouts.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'CodeSandbox': {
        const languages = ['html', 'javascript', 'css'];
        const randLang = languages[Math.floor(Math.random() * languages.length)];
        const templates = {
          html: `<h1>${tr("Randomized Canvas")}</h1>\n<p style="color: coral;">${tr("Generated seed:")} ${Math.random().toFixed(4)}</p>`,
          javascript: `console.log("${tr("Random parameters initialized!")}");\nconst seed = ${Math.random().toFixed(4)};\nalert("${tr("Randomizer Seed:")} " + seed);`,
          css: `body {\n  background: linear-gradient(135deg, #1e1b4b, #111827);\n  color: #10b981;\n  font-family: system-ui;\n}`
        };
        return {
          language: randLang,
          initialCode: templates[randLang as keyof typeof templates],
          title: tr("Randomized Code Experiment")
        };
      }
      case 'DataChart': {
        const types = ['bar', 'pie', 'donut', 'line'];
        const levels = ["middle_school", "high_school", "university"];
        const randVal1 = Math.floor(Math.random() * 50) + 10;
        const randVal2 = Math.floor(Math.random() * 50) + 10;
        const randVal3 = Math.floor(Math.random() * 50) + 10;
        const randData = [
          { label: tr("Alpha"), value: randVal1 },
          { label: tr("Beta"), value: randVal2 },
          { label: tr("Gamma"), value: randVal3 }
        ];
        return {
          title: tr("Randomized Metric Series"),
          type: types[Math.floor(Math.random() * types.length)],
          data: randData,
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'InteractiveDiagram': {
        const types = ['cell', 'neuron'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          type: types[Math.floor(Math.random() * types.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'FunctionManipulator': {
        const levels = ["middle_school", "high_school", "university"];
        return { gradeLevel: levels[Math.floor(Math.random() * levels.length)] };
      }
      case 'EquationManipulator': {
        const levels = ["middle_school", "high_school", "university"];
        return { gradeLevel: levels[Math.floor(Math.random() * levels.length)] };
      }
      case 'Geometry2D': {
        const presets = ['triangle', 'circle', 'vector'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          preset: presets[Math.floor(Math.random() * presets.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'GestaltInteractive': {
        const levels = ["middle_school", "high_school", "university"];
        return { gradeLevel: levels[Math.floor(Math.random() * levels.length)] };
      }
      default:
        return {};
    }
  };

  const DISCIPLINES_LIST = React.useMemo(() => {
    const staticEn = DISCIPLINES.map(d => d.EN);

};
