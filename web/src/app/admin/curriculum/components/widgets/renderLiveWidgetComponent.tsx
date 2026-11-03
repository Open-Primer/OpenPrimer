import React from 'react';
import { Mermaid } from '@/components/mdx/Mermaid';
import { StructureViewer3D } from '@/components/mdx/StructureViewer3D';
import { QuantumOrbitalExplorer } from '@/components/mdx/QuantumOrbitalExplorer';
import { DynamicSimulation } from '@/components/mdx/DynamicSimulation';
import { ChemicalStoichiometry } from '@/components/mdx/ChemicalStoichiometry';
import { BasicMathExplorer } from '@/components/mdx/BasicMathExplorer';
import { FunctionPlotter } from '@/components/mdx/FunctionPlotter';
import { ComparisonSlider } from '@/components/mdx/ComparisonSlider';
import { CodeSandbox } from '@/components/mdx/CodeSandbox';
import { DataChart } from '@/components/mdx/DataChart';
import { InteractiveDiagram } from '@/components/mdx/InteractiveDiagram';
import { FunctionManipulator } from '@/components/mdx/FunctionManipulator';
import { EquationManipulator } from '@/components/mdx/EquationManipulator';
import { Geometry2D } from '@/components/mdx/Geometry2D';
import { GestaltInteractive } from '@/components/mdx/GestaltInteractive';
import { LogicGateSimulator } from '@/components/mdx/LogicGateSimulator';
import { GeneticsPedigreeLab } from '@/components/mdx/GeneticsPedigreeLab';
import { OrbitalMechanicsSim } from '@/components/mdx/OrbitalMechanicsSim';
import { PeriodicTable } from '@/components/mdx/PeriodicTable';
import { SolarSystemOrrery } from '@/components/mdx/SolarSystemOrrery';
import { FinancialChart } from '@/components/mdx/FinancialChart';
import { WaveInterferenceSim } from '@/components/mdx/WaveInterferenceSim';
import { AcousticPianoSynth } from '@/components/mdx/AcousticPianoSynth';
import { SankeyDiagram } from '@/components/mdx/SankeyDiagram';

export const renderLiveWidgetComponent = (
  selectedWidget: any,
  activePresetProps: any,
  randomProps: any,
  widgetVersionKey: number,
  tr: (k: string) => string
): React.ReactNode => {
  if (!selectedWidget) return null;

  const effectiveProps = {
    ...activePresetProps,
    ...(randomProps || {})
  };

  const keyProp = `${selectedWidget.id}_v${widgetVersionKey}`;

  switch (selectedWidget.id) {
    case 'StructureViewer3D':
      return <StructureViewer3D key={keyProp} {...effectiveProps} />;
    case 'QuantumOrbitalExplorer':
      return <QuantumOrbitalExplorer key={keyProp} {...effectiveProps} />;
    case 'DynamicSimulation':
      return <DynamicSimulation key={keyProp} {...effectiveProps} />;
    case 'ChemicalStoichiometry':
      return <ChemicalStoichiometry key={keyProp} {...effectiveProps} />;
    case 'BasicMathExplorer':
      return <BasicMathExplorer key={keyProp} {...effectiveProps} />;
    case 'FunctionPlotter':
      return <FunctionPlotter key={keyProp} {...effectiveProps} />;
    case 'ComparisonSlider':
      return <ComparisonSlider key={keyProp} {...effectiveProps} />;
    case 'CodeSandbox':
      return <CodeSandbox key={keyProp} {...effectiveProps} />;
    case 'DataChart':
      return <DataChart key={keyProp} {...effectiveProps} />;
    case 'InteractiveDiagram':
      return <InteractiveDiagram key={keyProp} {...effectiveProps} />;
    case 'FunctionManipulator':
      return <FunctionManipulator key={keyProp} {...effectiveProps} />;
    case 'EquationManipulator':
      return <EquationManipulator key={keyProp} {...effectiveProps} />;
    case 'Geometry2D':
      return <Geometry2D key={keyProp} {...effectiveProps} />;
    case 'GestaltInteractive':
      return <GestaltInteractive key={keyProp} {...effectiveProps} />;
    case 'LogicGateSimulator':
      return <LogicGateSimulator key={keyProp} {...effectiveProps} />;
    case 'GeneticsPedigreeLab':
      return <GeneticsPedigreeLab key={keyProp} {...effectiveProps} />;
    case 'OrbitalMechanicsSim':
      return <OrbitalMechanicsSim key={keyProp} {...effectiveProps} />;
    case 'PeriodicTable':
      return <PeriodicTable key={keyProp} {...effectiveProps} />;
    case 'SolarSystemOrrery':
      return <SolarSystemOrrery key={keyProp} {...effectiveProps} />;
    case 'FinancialChart':
      return <FinancialChart key={keyProp} {...effectiveProps} />;
    case 'WaveInterferenceSim':
      return <WaveInterferenceSim key={keyProp} {...effectiveProps} />;
    case 'AcousticPianoSynth':
      return <AcousticPianoSynth key={keyProp} {...effectiveProps} />;
    case 'SankeyDiagram':
      return <SankeyDiagram key={keyProp} {...effectiveProps} />;
    case 'Mermaid':
      return <Mermaid key={keyProp} {...effectiveProps} />;
    default:
      return (
        <div className="p-8 text-center text-slate-400">
          <p>{tr("Live component preview is not registered for this widget.")}</p>
        </div>
      );
  }
};
