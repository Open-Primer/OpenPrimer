import { MockCourse } from '../types';

export const mockCoursesPart1: MockCourse[] = [
  { 
    id: 1, 
    title: "Classical Mechanics", 
    slug: "Classical_Mechanics", 
    level: "L1", 
    subject: "Physics", 
    description: "Feynman-optimized Classical Mechanics syllabus covering vector dynamics, laws of motion, and rotational energy.", 
    languages: ["en", "fr", "es", "de", "zh"], 
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 6, 
    hours: 150,
    prerequisites: ["Calculus I", "General Physics (Introduction)"],
    recommended_next_steps: ["Quantum Physics"],
    recommendedNextSteps: ["Quantum Physics"],
    units: [
      { title: "Kinematics", modules: ["Position Vectors", "Polar Coordinates", "Frenet Frames"] },
      { title: "Dynamics", modules: ["Newton's Laws", "Differential Equations", "Momentum"] },
      { title: "Work & Energy", modules: ["Work-Energy Theorem", "Potential Energy", "Conservative Forces"] }
    ],
    popularity: 1250, 
    is_active: true,
    validations: 12,
    created_at: new Date(2026, 1, 21).toISOString(), // stable timestamp to prevent hydration mismatch
    last_revision_date: new Date(2026, 5, 6).toISOString(),
    translations: {
      EN: { title: "Physics: Classical Mechanics", description: "Feynman-optimized Classical Mechanics syllabus covering vector dynamics, laws of motion, and rotational energy." },
      FR: { title: "Physique : Mécanique Classique", description: "Syllabus de mécanique classique optimisé par Feynman, couvrant la dynamique vectorielle, les lois du mouvement et l'énergie de rotation." },
      ES: { title: "Física: Mecánica Clásica", description: "Plan de estudios de Mecánica Clásica optimizado por Feynman que cubre la dinámica de vectores, las leyes del movimiento y la energía de rotación." },
      DE: { title: "Physik: Klassische Mechanik", description: "Feynman-optimierter Lehrplan für klassische Mechanik, der Vektordynamik, Bewegunggesetze und Rotationsenergie abdeckt." },
      ZH: { title: "物理：经典力学", description: "费曼优化的经典力学课程大纲，涵盖向量动力学、运动定律和旋转能量。" }
    }
  },
  { 
    id: 2, 
    title: "Quantum Physics", 
    slug: "Physique_Test_L2", 
    level: "L2", 
    subject: "Physics", 
    description: "Quantum physics systems, wave-particle duality, wave equations, and atomic structures.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 8, 
    hours: 200,
    prerequisites: ["Classical Mechanics", "Linear Algebra"],
    recommended_next_steps: ["Sovereign AI Mastery Curriculum"],
    recommendedNextSteps: ["Sovereign AI Mastery Curriculum"],
    units: [
      { title: "Quantum States", modules: ["Wave-Particle Duality", "Schrödinger Equation", "State Vectors"] },
      { title: "Quantum Operators", modules: ["Hermitian Operators", "Eigenvalues", "Uncertainty Principle"] }
    ],
    popularity: 840, 
    is_active: true,
    validations: 3,
    created_at: new Date(2026, 2, 13).toISOString(),
    last_revision_date: new Date(2026, 4, 7).toISOString(),
    translations: {
      EN: { title: "Physics: Quantum Physics (L2)", description: "Quantum physics systems, wave-particle duality, wave equations, and atomic structures." },
      FR: { title: "Physique : Physique Quantique (L2)", description: "Systèmes de physique quantique, dualité onde-particule, équations d'onde et structures atomiques." },
      ES: { title: "Física: Física Cuántica (L2)", description: "Sistemas de física cuántica, dualidad onda-partícula, ecuaciones de onda y estructuras atómicas." },
      DE: { title: "Physik: Quantenphysik (L2)", description: "Quantenphysikalische Systeme, Welle-Teilchen-Dualismus, Wellengleichungen und atomare Strukturen." },
      ZH: { title: "物理：量子物理 (L2)", description: "量子物理系统、波粒二象性、波动方程和原子结构。" }
    }
  },
  { 
    id: 3, 
    title: "Cell Biology", 
    slug: "Biologie_Test", 
    level: "L1", 
    subject: "Biology", 
    description: "University-grade Cell Biology covering organelles, lipid bilayers, metabolic pathways, and ATP cycles.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    hours: 150,
    prerequisites: ["General Chemistry", "Introduction to Biology"],
    recommended_next_steps: ["Molecular Genetics"],
    recommendedNextSteps: ["Molecular Genetics"],
    units: [
      { title: "Cellular Structures", modules: ["Membrane Dynamics", "Organelles", "Cytoskeleton"] },
      { title: "Metabolism", modules: ["Glycolysis", "Krebs Cycle", "Oxidative Phosphorylation"] }
    ],
    popularity: 2400, 
    is_active: true,
    validations: 15,
    created_at: new Date(2026, 2, 3).toISOString(),
    last_revision_date: new Date(2026, 5, 14).toISOString(),
    translations: {
      EN: { title: "Biology: Cell Biology", description: "University-grade Cell Biology covering organelles, lipid bilayers, metabolic pathways, and ATP cycles." },
      FR: { title: "Biologie : Biologie Cellulaire", description: "Biologie cellulaire de niveau universitaire couvrant les organites, les bicouches lipidiques, les voies métaboliques et les cycles de l'ATP." },
      ES: { title: "Biología: Biología Celular", description: "Biología celular de nivel universitario que cubre orgánulos, bicapas lipídicas, vías metabólicas y ciclos de ATP." },
      DE: { title: "Biologie: Zellbiologie", description: "Zellbiologie auf Universitätsniveau, die Organellen, Lipiddoppelschichten, Stoffwechselwege und ATP-Zyklen abdeckt." },
      ZH: { title: "生物：细胞生物学", description: "大学水平的细胞生物学，涵盖细胞器、脂质双分子层、代谢途径和 ATP 循环。" }
    }
  },
  { 
    id: 4, 
    title: "Molecular Genetics", 
    slug: "Biologie_Test_L1", 
    level: "L1", 
    subject: "Biology", 
    description: "Academic syllabus on molecular genetics covering DNA replication, gene expression, and inheritance mechanisms.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    hours: 150,
    prerequisites: ["Biologie Cellulaire L1"],
    recommended_next_steps: ["Biologie Cellulaire L1"],
    recommendedNextSteps: ["Biologie Cellulaire L1"],
    units: [
      { title: "Genetic Code", modules: ["DNA Replication", "Transcription Factors", "Translation"] },
      { title: "Gene Regulation", modules: ["Operons", "Epigenetics", "Recombinant DNA"] }
    ],
    popularity: 1800, 
    is_active: true,
    validations: 8,
    created_at: new Date(2026, 2, 18).toISOString(),
    last_revision_date: new Date(2026, 5, 22).toISOString(),
    translations: {
      EN: { title: "Biology: Molecular Genetics", description: "Academic syllabus on molecular genetics covering DNA replication, gene expression, and inheritance mechanisms." },
      FR: { title: "Biologie : Génétique Moléculaire", description: "Syllabus académique de génétique moléculaire couvrant la réplication de l'ADN, l'expression des gènes et les mécanismes d'hérédité." },
      ES: { title: "Biología: Genética Molecular", description: "Plan de estudios académico sobre genética molecular que cubre la replicación del ADN, la expresión génica y los mecanismos de herencia." },
      DE: { title: "Biologie: Molekulargenetik", description: "Akademischer Lehrplan zur Molekulargenetik, der DNA-Replikation, Genexpression und Vererbungsmechanismen abdeckt." },
      ZH: { title: "生物：分子遗传学", description: "分子遗传学学术教学大纲，涵盖 DNA 复制、基因表达和遗传机制。" }
    }
  },
  { 
    id: 5, 
    title: "Constitutional Law", 
    slug: "Droit_Test", 
    level: "L1", 
    subject: "Law", 
    description: "Elite legal course on national sovereignty, division of constitutional powers, and governance structures.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    hours: 150,
    prerequisites: ["Introduction to Legal Studies"],
    recommended_next_steps: ["Criminal Law"],
    recommendedNextSteps: ["Criminal Law"],
    units: [
      { title: "Constitutional Systems", modules: ["Separation of Powers", "Judicial Review", "Federalism"] },
      { title: "Fundamental Rights", modules: ["Due Process", "Equal Protection", "Freedom of Expression"] }
    ],
    popularity: 1500, 
    is_active: true,
    validations: 2,
    created_at: new Date(2026, 0, 22).toISOString(),
    last_revision_date: new Date(2026, 4, 22).toISOString(),
    translations: {
      EN: { title: "Law: Constitutional Law", description: "Elite legal course on national sovereignty, division of constitutional powers, and governance structures." },
      FR: { title: "Droit : Droit Constitutionnel", description: "Cours juridique d'élite sur la souveraineté nationale, la division des pouvoirs constitutionnels et les structures de gouvernance." },
      ES: { title: "Derecho: Derecho Constitucional", description: "Curso legal de élite sobre soberanía nacional, división de poderes constitucionales y estructuras de gobernanza." },
      DE: { title: "Recht: Verfassungsrecht", description: "Elite-Rechtskurs über nationale Souveränität, Gewaltenteilung und Regierungsstrukturen." },
      ZH: { title: "法律：宪法学", description: "关于国家主权、宪法权力划分 and 治理结构的精英法律课程。" }
    }
  },
  { 
    id: 6, 
    title: "Criminal Law", 
    slug: "Droit_Test_L2", 
    level: "L2", 
    subject: "Law", 
    description: "Comprehensive study of general criminal responsibility, elements of offense, and legal precedents.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 5, 
    hours: 150,
    prerequisites: ["Constitutional Law L1"],
    recommended_next_steps: ["Sovereign AI Mastery Curriculum"],
    recommendedNextSteps: ["Sovereign AI Mastery Curriculum"],
    units: [
      { title: "General Principles", modules: ["Actus Reus", "Mens Rea", "Strict Liability"] },
      { title: "Specific Offenses", modules: ["Homicide", "Property Crimes", "Defenses"] }
    ],
    popularity: 950, 
    is_active: true,
    validations: 1,
    created_at: new Date(2026, 2, 21).toISOString(),
    last_revision_date: new Date(2026, 5, 18).toISOString(),
    translations: {
      EN: { title: "Law: Criminal Law (L2)", description: "Comprehensive study of general criminal responsibility, elements of offense, and legal precedents." },
      FR: { title: "Droit : Droit Pénal (L2)", description: "Étude complète de la responsabilité pénale générale, des éléments de l'infraction et des précédents juridiques." },
      ES: { title: "Derecho: Derecho Penal (L2)", description: "Estudio integral de la responsabilidad penal general, elementos del delito y precedentes legales." },
      DE: { title: "Recht: Strafrecht (L2)", description: "Umfassendes Studium der allgemeinen strafrechtlichen Verantwortlichkeit, Tatbestandsmerkmale und rechtlichen Präzedenzfälle." },
      ZH: { title: "法律：刑法学 (L2)", description: "全面研究一般刑事责任、犯罪要素和法律先例。" }
    }
  },
  { 
    id: 7, 
    title: "Linear Algebra", 
    slug: "Maths_Test", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Rigorous Linear Algebra course covering vector spaces, linear transformations, matrices, and eigenvalues.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    hours: 150,
    prerequisites: ["High School Algebra"],
    recommended_next_steps: ["Sovereign AI Mastery Curriculum"],
    recommendedNextSteps: ["Sovereign AI Mastery Curriculum"],
    units: [
      { title: "Vector Spaces", modules: ["Linear Combinations", "Span & Basis", "Dimension"] },
      { title: "Linear Transformations", modules: ["Matrices", "Kernel & Image", "Determinants"] }
    ],
    popularity: 3100, 
    is_active: true,
    validations: 25,
    created_at: new Date(2026, 4, 22).toISOString(),
    last_revision_date: new Date(2026, 5, 19).toISOString(),
    translations: {
      EN: { title: "Mathematics: Linear Algebra", description: "Rigorous Linear Algebra course covering vector spaces, linear transformations, matrices, and eigenvalues." },
      FR: { title: "Mathématiques : Algèbre Linéaire", description: "Cours rigoureux d\'algèbre linéaire couvrant les espaces vectoriels, les transformations linéaires, les matrices et les valeurs propres." },
      ES: { title: "Matemáticas: Álgebra Lineal", description: "Riguroso curso de Álgebra Lineal que cubre espacios vectoriales, transformaciones lineales, matrices y valores propios." },
      DE: { title: "Mathematik: Lineare Algebra", description: "Strenger Kurs in linearer Algebra, der Vektorräume, lineare Abbildungen, Matrizen und Eigenwerte abdeckt." },
      ZH: { title: "数学：线性代数", description: "严谨的线性代数课程，涵盖向量空间、线性变换、矩阵和特征值。" }
    }
  },
  { 
    id: 8, 
    title: "Calculus I", 
    slug: "Maths_Test_L1", 
    level: "L1", 
    subject: "Mathematics", 
    description: "Foundational Calculus covering limits, derivative analysis, optimization, and integration pathways.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    hours: 150,
    prerequisites: ["High School Precalculus"],
    recommended_next_steps: ["Linear Algebra", "L1 Statistics"],
    recommendedNextSteps: ["Linear Algebra", "L1 Statistics"],
    units: [
      { title: "Limits & Continuity", modules: ["Delta-Epsilon Definition", "Squeeze Theorem", "Asymptotes"] },
      { title: "Derivatives", modules: ["Chain Rule", "Implicit Differentiation", "Optimization"] }
    ],
    popularity: 4200, 
    is_active: true,
    validations: 32,
    created_at: new Date(2026, 2, 3).toISOString(),
    last_revision_date: new Date(2026, 5, 1).toISOString(),
    translations: {
      EN: { title: "Mathematics: Calculus I", description: "Foundational Calculus covering limits, derivative analysis, optimization, and integration pathways." },
      FR: { title: "Mathématiques : Analyse I", description: "Calcul différentiel et intégral fondamental couvrant les limites, l\'analyse des dérivées, l\'optimisation et les voies d\'intégration." },
      ES: { title: "Matemáticas: Cálculo I", description: "Cálculo fundamental que cubre límites, análisis de derivadas, optimización y vías de integración." },
      DE: { title: "Mathematik: Analysis I", description: "Grundlegende Analysis, die Grenzwerte, Ableitungsanalyse, Optimierung und Integrationspfade abdeckt." },
      ZH: { title: "数学：微积分 I", description: "基础微积分，涵盖极限、导数分析、优化和积分路径。" }
    }
  },
  { 
    id: 9, 
    title: "Organic Chemistry", 
    slug: "organic-chemistry", 
    level: "L1", 
    subject: "Chemistry", 
    description: "Rigorous organic chemistry syllabus covering stereochemistry, reaction mechanisms, and carbon synthesis.", 
    languages: ["en"], 
    langs: ["en"],
    ects: 6, 
    hours: 150,
    prerequisites: ["General Chemistry"],
    recommended_next_steps: ["Structural Biochemistry L1"],
    recommendedNextSteps: ["Structural Biochemistry L1"],
    units: [
      { title: "Hydrocarbons", modules: ["Alkanes & Alkenes", "Stereochemistry", "Conformational Analysis"] },
      { title: "Reactions", modules: ["Nucleophilic Substitution", "Elimination Reactions", "Electrophilic Addition"] }
    ],
    popularity: 1100, 
    is_active: true,
    validations: 4,
    created_at: new Date(2025, 11, 23).toISOString(),
    last_revision_date: new Date(2026, 2, 23).toISOString(),
    translations: {
      EN: { title: "Chemistry: Organic Chemistry", description: "Rigorous organic chemistry syllabus covering stereochemistry, reaction mechanisms, and carbon synthesis." },
      FR: { title: "Chimie : Chimie Organique", description: "Syllabus rigoureux de chimie organique couvrant la stéréochimie, les mécanismes de réaction et la synthèse du carbone." },
      ES: { title: "Química: Química Orgánica", description: "Riguroso plan de estudios de química orgánica que cubre estereoquímica, mecanismos de reacción y síntesis de carbono." },
      DE: { title: "Chemie: Organische Chemie", description: "Strenger Lehrplan für organische Chemie, der Stereochemie, Reaktionsmechanismen und Kohlenstoffsynthese abdeckt." },
      ZH: { title: "化学：有机化学", description: "严谨的有机化学大纲，涵盖立体化学、反应机理 and 碳合成。" }
    }
  },
  { 
    id: 10, 
    title: "Microeconomics", 
    slug: "Economie_Test", 
    level: "L1", 
    subject: "Economics", 
    description: "Advanced Microeconomics covering consumer behavior, market structures, pricing strategies, and game theory.", 
    languages: ["en", "fr"], 
    langs: ["en", "fr"],
    ects: 6, 
    hours: 150,
    prerequisites: ["Calculus I"],
    recommended_next_steps: ["Macroeconomics L1"],
    recommendedNextSteps: ["Macroeconomics L1"],
    units: [
      { title: "Consumer Theory", modules: ["Preferences & Utility", "Budget Constraint", "Optimal Choice"] },
      { title: "Producer Theory", modules: ["Production Functions", "Cost Minimization", "Profit Maximization"] }
    ],
    popularity: 1600, 
    is_active: true,
    validations: 6,
    created_at: new Date(2026, 4, 22).toISOString(),
    last_revision_date: new Date(2026, 5, 20).toISOString(),
    translations: {
      EN: { title: "Economics: Microeconomics", description: "Advanced Microeconomics covering consumer behavior, market structures, pricing strategies, and game theory." },
      FR: { title: "Économie : Microéconomie", description: "Microéconomie avancée couvrant le comportement des consommateurs, les structures de marché, les stratégies de prix et la théorie des jeux." },
      ES: { title: "Economía: Microeconomía", description: "Microeconomía avanzada que cubre el comportamiento del consumidor, las estructuras del mercado, las estrategias de precios y la teoría de juegos." },
      DE: { title: "Wirtschaft: Mikroökonomie", description: "Fortgeschrittene Mikroökonomie, die Konsumentenverhalten, Marktstrukturen, Preisstrategien und Spieltheorie abdeckt." },
      ZH: { title: "经济学：微观经济学", description: "高级微观经济学，涵盖消费者行为、市场结构、定价策略和博弈论。" }
    }
  },
  { 
    id: 11, 
    title: "L1 Statistics", 
    slug: "Statistics", 
    level: "L1", 
    subject: "Mathematics", 
    description: "First-year university statistics covering basic probability, descriptive metrics, and inferential modeling.", 
    languages: ["en", "fr", "es", "de", "zh"], 
    langs: ["en", "fr", "es", "de", "zh"],
    ects: 6, 
    hours: 150,
    prerequisites: ["High School Mathematics"],
    recommended_next_steps: ["Sovereign AI Mastery Curriculum"],
    recommendedNextSteps: ["Sovereign AI Mastery Curriculum"],
    units: [
      { title: "Probability", modules: ["Combinatorics", "Bayes Theorem", "Random Variables"] },
      { title: "Statistical Inference", modules: ["Hypothesis Testing", "Confidence Intervals", "Regression"] }
    ],
    popularity: 1850, 
    is_active: true,
    validations: 11,
    created_at: new Date(2026, 5, 16).toISOString(),
    last_revision_date: new Date(2026, 5, 21).toISOString(),
    translations: {
      EN: { title: "L1 Statistics", description: "First-year university statistics covering basic probability, descriptive metrics, and inferential modeling." },
      FR: { title: "Statistiques L1", description: "Statistiques universitaires de première année couvrant les probabilités de base, les métriques descriptives et la modélisation inférentielle." },
      ES: { title: "Estadísticas L1", description: "Estadísticas universitarias de primer año que cubren probabilidad básica, métricas descriptivas y modelos de inferencia." },
      DE: { title: "L1 Statistik", description: "L1 Statistik, die grundlegende Wahrscheinlichkeitsrechnung, deskiptive Metriken und inferenzielle Modellierung abdeckt." },
      ZH: { title: "一年级统计学", description: "第一年大学统计学，涵盖基本概率、描述性度量和推断建模。" }
    }
  }
];
