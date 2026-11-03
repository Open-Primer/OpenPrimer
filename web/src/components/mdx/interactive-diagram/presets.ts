export interface Hotspot {
  id: string;
  name: string;
  x: number; // percentage coordinate x
  y: number; // percentage coordinate y
  description: string;
}

export interface InteractiveDiagramProps {
  title?: string;
  hotspots?: Hotspot[];
  type?: 'cell' | 'neuron' | 'custom';
  hotspotsBase64?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

export const DEFAULT_CELL_HOTSPOTS: Hotspot[] = [
  {
    id: "noyau",
    name: "Nucleus",
    x: 50,
    y: 50,
    description: "The control center of the cell. It contains DNA as chromatin and directs protein synthesis and cell division."
  },
  {
    id: "mitochondrie",
    name: "Mitochondria",
    x: 25,
    y: 40,
    description: "The powerhouse of the cell. This is where cellular respiration occurs to generate ATP, the fuel of life."
  },
  {
    id: "cytoplasme",
    name: "Cytoplasm",
    x: 70,
    y: 35,
    description: "The gelatinous fluid (mainly composed of water) that fills the cell and suspends all other organelles."
  },
  {
    id: "membrane",
    name: "Plasma Membrane",
    x: 88,
    y: 50,
    description: "The selective outer barrier of the cell, regulating the entry and exit of nutrients and wastes."
  },
  {
    id: "ribosome",
    name: "Ribosomes",
    x: 60,
    y: 70,
    description: "Tiny molecular machines responsible for synthesizing proteins from the RNA genetic code."
  }
];

export const DEFAULT_NEURON_HOTSPOTS: Hotspot[] = [
  {
    id: "soma",
    name: "Soma (Cell Body)",
    x: 35,
    y: 50,
    description: "The central part of the neuron containing the cell nucleus and essential organelles. This is where received electrical signals are integrated before being transmitted to the axon."
  },
  {
    id: "dendrites",
    name: "Dendrites",
    x: 15,
    y: 25,
    description: "Short branching extensions prolonging the cell body. They act as receiving antennas to capture chemical signals (neurotransmitters) from other neurons."
  },
  {
    id: "axone",
    name: "Axon",
    x: 55,
    y: 52,
    description: "A long unique extension that conducts the electrical message (action potential) from the cell body to the terminal buttons to transmit it to other cells."
  },
  {
    id: "myeline",
    name: "Myelin Sheath",
    x: 72,
    y: 44,
    description: "A protective envelope rich in lipids formed by Schwann cells. It insulates the axon and significantly increases the speed of nerve impulse propagation by saltatory conduction."
  },
  {
    id: "synapse",
    name: "Synapse (Axon Terminals)",
    x: 90,
    y: 62,
    description: "The terminal branches of the axon containing vesicles of neurotransmitters. This is where the electrical impulse is converted into a chemical signal to cross the synaptic cleft."
  }
];

// Dummy array to force extraction of all localized strings by the backend i18n parser
export const _dummy_translations = (t: any) => [
  t("Nucleus"),
  t("The control center of the cell. It contains DNA as chromatin and directs protein synthesis and cell division."),
  t("Mitochondria"),
  t("The powerhouse of the cell. This is where cellular respiration occurs to generate ATP, the fuel of life."),
  t("Cytoplasm"),
  t("The gelatinous fluid (mainly composed of water) that fills the cell and suspends all other organelles."),
  t("Plasma Membrane"),
  t("The selective outer barrier of the cell, regulating the entry and exit of nutrients and wastes."),
  t("Ribosomes"),
  t("Tiny molecular machines responsible for synthesizing proteins from the RNA genetic code."),

  t("Soma (Cell Body)"),
  t("The central part of the neuron containing the cell nucleus and essential organelles. This is where received electrical signals are integrated before being transmitted to the axon."),
  t("Dendrites"),
  t("Short branching extensions prolonging the cell body. They act as receiving antennas to capture chemical signals (neurotransmitters) from other neurons."),
  t("Axon"),
  t("A long unique extension that conducts the electrical message (action potential) from the cell body to the terminal buttons to transmit it to other cells."),
  t("Myelin Sheath"),
  t("A protective envelope rich in lipids formed by Schwann cells. It insulates the axon and significantly increases the speed of nerve impulse propagation by saltatory conduction."),
  t("Synapse (Axon Terminals)"),
  t("The terminal branches of the axon containing vesicles of neurotransmitters. This is where the electrical impulse is converted into a chemical signal to cross the synaptic cleft."),

  // UI labels
  t("INTERACTIVE EXPLORATION"),
  t("Hide Labels"),
  t("Show Labels"),
  t("ACTIVE COMPONENT"),
  t("Select a component"),
  t("Click on the bulb icons on the diagram to display details and physiological characteristics."),
  t("Neuron Anatomy"),
  t("Interactive Diagram: Eukaryotic Cell")
];

export const decodeBase64Utf8 = (str: string): string => {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(
      window.atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } else {
    return Buffer.from(str, 'base64').toString('utf-8');
  }
};
