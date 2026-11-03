export const LJ_TRANSLATIONS: Record<string, Record<string, string>> = {
  potential_title: {
    EN: "🔬 Lennard-Jones Potential",
    FR: "🔬 Potentiel de Lennard-Jones",
    ES: "🔬 Potencial de Lennard-Jones",
    DE: "🔬 Lennard-Jones-Potenzial",
    ZH: "🔬 伦纳德-琼斯势"
  },
  distance_axis: {
    EN: "Distance r (Å)",
    FR: "Distance r (Å)",
    ES: "Distancia r (Å)",
    DE: "Abstand r (Å)",
    ZH: "距离 r (Å)"
  },
  energy_axis: {
    EN: "Energy V(r) (eV)",
    FR: "Énergie V(r) (eV)",
    ES: "Energía V(r) (eV)",
    DE: "Energie V(r) (eV)",
    ZH: "能量 V(r) (eV)"
  },
  physical_desc: {
    EN: "Physical Description",
    FR: "Description Physique",
    ES: "Descripción Física",
    DE: "Physikalische Beschreibung",
    ZH: "物理描述"
  },
  epsilon_label: {
    EN: "Well Depth (ε - Epsilon)",
    FR: "Profondeur du puits (ε - Epsilon)",
    ES: "Profundidad del pozo (ε - Epsilon)",
    DE: "Wellentiefe (ε - Epsilon)",
    ZH: "势阱深度 (ε - Epsilon)"
  },
  sigma_label: {
    EN: "Collision Diameter (σ - Sigma)",
    FR: "Diamètre de collision (σ - Sigma)",
    ES: "Diámetro de colisión (σ - Sigma)",
    DE: "Kollisionsdurchmesser (σ - Sigma)",
    ZH: "碰撞直径 (σ - Sigma)"
  },
  repulsion_title: {
    EN: "Repulsive Force (r⁻¹²)",
    FR: "Force de Répulsion (r⁻¹²)",
    ES: "Fuerza Repulsiva (r⁻¹²)",
    DE: "Abstoßungskraft (r⁻¹²)",
    ZH: "排斥力 (r⁻¹²)"
  },
  repulsion_desc: {
    EN: "At short distances (r < σ), electron cloud overlap causes strong repulsion based on the Pauli exclusion principle.",
    FR: "À courte distance (r < σ), le recouvrement des nuages électroniques provoque une forte répulsion due au principe d'exclusion de Pauli.",
    ES: "A distancias cortas (r < σ), la superposición de nubes de electrones causa una fuerte repulsión debido al principio de exclusión de Pauli.",
    DE: "Bei kurzen Abständen (r < σ) führt die Überlappung der Elektronenwolken zu einer starken Abstoßung basierend auf dem Pauli-Prinzip.",
    ZH: "在短距离 (r < σ) 内，由于保利不相容原理，电子云重叠会导致强烈的排斥力。"
  },
  attraction_title: {
    EN: "Attractive Force (r⁻⁶)",
    FR: "Force d'Attraction (r⁻⁶)",
    ES: "Fuerza Atractiva (r⁻⁶)",
    DE: "Anziehungskraft (r⁻⁶)",
    ZH: "吸引力 (r⁻⁶)"
  },
  attraction_desc: {
    EN: "At longer distances, van der Waals (London dispersion) forces create attraction between dipoles.",
    FR: "À plus longue distance, les forces de van der Waals (dispersion de London) créent une attraction entre les dipoles.",
    ES: "A distancias más largas, las forces de van der Waals (dispersión de London) crean atracción entre dipolos.",
    DE: "Bei größeren Abständen erzeugen Van-der-Waals-Kräfte (London-Dispersionskräfte) eine Anziehung zwischen Dipolen.",
    ZH: "在较长距离内，范德华力 (伦敦色散力) 会在偶极子之间产生吸引力。"
  },
  equilibrium_title: {
    EN: "Equilibrium Distance (rₘ)",
    FR: "Distance d'Équilibre (rₘ)",
    ES: "Distancia de Equilibrio (rₘ)",
    DE: "Gleichgewichtsabstand (rₘ)",
    ZH: "平衡距离 (rₘ)"
  },
  equilibrium_desc: {
    EN: "The system is most stable at rₘ = 2¹/⁶σ (approx. 1.12σ), where the force is zero and potential energy is at its minimum (-ε).",
    FR: "Le système est le plus stable à rₘ = 2¹/⁶σ (env. 1,12σ), où la force est nulle et l'énergie potentielle est minimale (-ε).",
    ES: "El sistema es más estable en rₘ = 2¹/⁶σ (aprox. 1.12σ), donde la fuerza es cero y la energía potencial es mínima (-ε).",
    DE: "Das System ist bei rₘ = 2¹/⁶σ (ca. 1,12σ) am stabilsten, wo die Kraft null ist und die potenzielle Energie ihr Minimum (-ε) erreicht.",
    ZH: "系统在 rₘ = 2¹/⁶σ (约 1.12σ) 时最稳定，此时力为零且势能最小 (-ε)。"
  }
};

export const getLjString = (key: string, langKey: string): string => {
  return LJ_TRANSLATIONS[key]?.[langKey] || LJ_TRANSLATIONS[key]?.EN || "";
};
