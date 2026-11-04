export const ACADEMIC_LEVELS = [
  { value: 'foundation_1', EN: 'Primary School 1 (Ages 6–9)', FR: 'Fondamental 1 (CP–CE2)', ES: 'Fundacional 1 (6–9 años)', DE: 'Grundstufe 1 (6–9 J.)', ZH: '\u57fa\u7840\u4e00\u9636\uff086\u20139\u5c81\uff09' },
  { value: 'foundation_2', EN: 'Primary School 2 (Ages 9–11)', FR: 'Fondamental 2 (CM1–CM2)', ES: 'Fundacional 2 (9–11 años)', DE: 'Grundstufe 2 (9–11 J.)', ZH: '\u57fa\u7840\u4e8c\u9636\uff089\u201311\u5c81\uff09' },
  { value: 'secondary_1', EN: 'Middle School 1 (Ages 11–13)', FR: 'Secondaire 1 (6ème–5ème)', ES: 'Secundaria 1 (11–13 años)', DE: 'Sekundarstufe I-1 (11–13 J.)', ZH: '\u521d\u4e2d\u4e00\u9636\uff0811\u201313\u5c81\uff09' },
  { value: 'secondary_2', EN: 'Middle School 2 (Ages 13–15)', FR: 'Secondaire 2 (4ème–3ème)', ES: 'Secundaria 2 (13–15 años)', DE: 'Sekundarstufe I-2 (13–15 J.)', ZH: '\u521d\u4e2d\u4e8c\u9636\uff0813\u201315\u5c81\uff09' },
  { value: 'preuni_1',     EN: 'Pre-University 1 (Ages 15–16)', FR: 'Lycée 1 — Seconde', ES: 'Bachillerato 1 (15–16 años)', DE: 'Gymnasium — Klasse 10', ZH: '\u9ad8\u4e2d\u4e00\u5e74\u7ea7\uff0815\u201316\u5c81\uff09' },
  { value: 'preuni_2',     EN: 'Pre-University 2 (Ages 16–17)', FR: 'Lycée 2 — Première', ES: 'Bachillerato 2 (16–17 años)', DE: 'Gymnasium — Klasse 11', ZH: '\u9ad8\u4e2d\u4e8c\u5e74\u7ea7\uff0816\u201317\u5c81\uff09' },
  { value: 'preuni_3',     EN: 'Pre-University 3 (Ages 17–18)', FR: 'Lycée 3 — Terminale', ES: 'Bachillerato 3 — Selectividad', DE: 'Abitur — Abschlussklasse', ZH: '\u9ad8\u4e2d\u4e09\u5e74\u7ea7\uff08\u9ad8\u8003\uff09' },
  { value: 'L1',           EN: 'L1 — 1st Year (University)', FR: 'L1 — 1ère Année Universitaire', ES: 'L1 — Primer Año', DE: 'L1 — 1. Studienjahr', ZH: 'L1 — \u5927\u4e00' },
  { value: 'L2',           EN: 'L2 — 2nd Year (University)', FR: 'L2 — 2ème Année Universitaire', ES: 'L2 — Segundo Año', DE: 'L2 — 2. Studienjahr', ZH: 'L2 — \u5927\u4e8c' },
  { value: 'L3',           EN: "L3 — Bachelor's Year", FR: 'L3 — 3ème Année (Licence)', ES: 'L3 — Grado (3er Año)', DE: 'L3 — Bachelor (3. Jahr)', ZH: 'L3 — \u5927\u4e09\uff08\u5b68\u58eb\uff09' },
  { value: 'M1',           EN: 'M1 — 1st Year (Master)', FR: 'M1 — 1ère Année de Master', ES: 'M1 — Máster (1er Año)', DE: 'M1 — Master (1. Jahr)', ZH: 'M1 — \u7814\u4e00' },
  { value: 'M2',           EN: 'M2 — 2nd Year (Master)', FR: 'M2 — 2ème Année de Master', ES: 'M2 — Máster (2o Año)', DE: 'M2 — Master (2. Jahr)', ZH: 'M2 — \u7814\u4e8c' }
] as const;

export const DISCIPLINES = [
  { value: 'mathematics',        EN: 'Mathematics', FR: 'Mathématiques', ES: 'Matemáticas', DE: 'Mathematik', ZH: '\u6570\u5b66' },
  { value: 'statistics',         EN: 'Statistics & Probability', FR: 'Statistiques & Probabilités', ES: 'Estadística y Probabilidad', DE: 'Statistik & Wahrscheinlichkeit', ZH: '\u7edf\u8ba1\u4e0e\u6982\u7387\u8bba' },
  { value: 'physics',            EN: 'Physics', FR: 'Physique', ES: 'Física', DE: 'Physik', ZH: '\u7269\u7406\u5b66' },
  { value: 'chemistry',          EN: 'Chemistry', FR: 'Chimie', ES: 'Química', DE: 'Chemie', ZH: '\u5316\u5b66' },
  { value: 'biology',            EN: 'Biology', FR: 'Biologie', ES: 'Biología', DE: 'Biologie', ZH: '\u751f\u7269\u5b66' },
  { value: 'biochemistry',       EN: 'Biochemistry', FR: 'Biochimie', ES: 'Bioquímica', DE: 'Biochemie', ZH: '\u751f\u7269\u5316\u5b66' },
  { value: 'genetics',           EN: 'Genetics', FR: 'Génétique', ES: 'Genética', DE: 'Genetik', ZH: '\u9057\u4f20\u5b66' },
  { value: 'computer_science',   EN: 'Computer Science', FR: 'Informatique', ES: 'Informática', DE: 'Informatik', ZH: '\u8ba1\u7b97\u673a\u79d1\u5b66' },
  { value: 'data_science',       EN: 'Data Science & Analytics', FR: 'Science des Données', ES: 'Ciencia de Datos', DE: 'Datenwissenschaft', ZH: '\u6570\u636e\u79d1\u5b66' },
  { value: 'law',                EN: 'Law', FR: 'Droit', ES: 'Derecho', DE: 'Rechtswissenschaften', ZH: '\u6cd5\u5b66' },
  { value: 'criminology',        EN: 'Criminology', FR: 'Criminologie', ES: 'Criminología', DE: 'Kriminologie', ZH: '\u72af\u7f6a\u5b66' },
  { value: 'political_science',  EN: 'Political Science', FR: 'Science Politique', ES: 'Ciencia Política', DE: 'Politikwissenschaft', ZH: '\u653f\u6cbb\u5b66' },
  { value: 'economics',          EN: 'Economics', FR: 'Économie', ES: 'Economía', DE: 'Wirtschaftswissenschaften', ZH: '\u7ecf\u6d48\u5b66' },
  { value: 'sociology',          EN: 'Sociology', FR: 'Sociologie', ES: 'Sociología', DE: 'Soziologie', ZH: '\u793e\u4f1a\u5b66' },
  { value: 'psychology',         EN: 'Psychology', FR: 'Psychologie', ES: 'Psicología', DE: 'Psychologie', ZH: '\u5fc3\u7406\u5b66' },
  { value: 'social_psychology',  EN: 'Social Psychology', FR: 'Psychologie Sociale', ES: 'Psicología Social', DE: 'Sozialpsychologie', ZH: '\u793e\u4f1a\u5fc3\u7406\u5b66' },
  { value: 'cognitive_science',  EN: 'Cognitive Science', FR: 'Sciences Cognitives', ES: 'Ciencia Cognitiva', DE: 'Kognitionswissenschaft', ZH: '\u8ba1\u7b97\u673a\u79d1\u5b66' },
  { value: 'history',            EN: 'History', FR: 'Histoire', ES: 'Historia', DE: 'Geschichte', ZH: '\u5386\u53f2\u5b66' },
  { value: 'philosophy',         EN: 'Philosophy', FR: 'Philosophie', ES: 'Filosofía', DE: 'Philosophie', ZH: '\u54f2\u5b66' },
  { value: 'theology',           EN: 'Theology', FR: 'Théologie', ES: 'Teología', DE: 'Theologie', ZH: '\u795e\u5b66' },
  { value: 'anthropology',       EN: 'Anthropology', FR: 'Anthropologie', ES: 'Antropología', DE: 'Anthropologie', ZH: '\u4eba\u7c7b\u5b66' },
  { value: 'performing_arts',    EN: 'Performing Arts (Dance & Theater)', FR: 'Arts du Spectacle (Danse & Théâtre)', ES: 'Artes Escénicas (Danza y Teatro)', DE: 'Darstellende Kunst', ZH: '\u8868\u6f14\u827a\u672f\uff08\u821e\u8e45\u4e0e\u620f\u5267\uff09' },
  { value: 'fine_arts',          EN: 'Fine Arts & Design', FR: 'Beaux-Arts & Design', ES: 'Bellas Artes y Diseño', DE: 'Bildende Kunst & Design', ZH: '\u7f8e\u672f\u4e0e\u8bbe\u8ba1' },
  { value: 'musicology',         EN: 'Musicology', FR: 'Musicologie', ES: 'Musicología', DE: 'Musicographie', ZH: '\u97f3\u4e50\u5b66' },
  { value: 'literature',         EN: 'Literature', FR: 'Littérature', ES: 'Literatura', DE: 'Literatur', ZH: '\u6587\u5b66' },
  { value: 'linguistics',        EN: 'Linguistics', FR: 'Linguistique', ES: 'Lingüística', DE: 'Linguistik', ZH: '\u8bed\u8a00\u5b66' },
  { value: 'geography',          EN: 'Geography', FR: 'Géographie', ES: 'Geografía', DE: 'Geographie', ZH: '\u5730\u7406\u5b66' },
  { value: 'geology',            EN: 'Geology & Earth Sciences', FR: 'Géologie & Sciences de la Terre', ES: 'Geología', DE: 'Geologie', ZH: '\u5730\u8d28\u5b66' },
  { value: 'astronomy',          EN: 'Astronomy & Astrophysics', FR: 'Astronomie & Astrophysique', ES: 'Astronomía', DE: 'Astronomie', ZH: '\u5929\u6587\u5b66' },
  { value: 'medicine',           EN: 'Medicine & Surgery', FR: 'Médecine & Chirurgie', ES: 'Medicina', DE: 'Medizin', ZH: '\u533b\u5b66' },
  { value: 'pharmacology',       EN: 'Pharmacology', FR: 'Pharmacologie', ES: 'Farmacología', DE: 'Pharmakologie', ZH: '\u836f\u7406\u5b66' },
  { value: 'neuroscience',       EN: 'Neuroscience', FR: 'Neurosciences', ES: 'Neurociencia', DE: 'Neurowissenschaften', ZH: '\u795e\u7ecf\u79d1\u5b66' },
  { value: 'mechanical_eng',     EN: 'Mechanical Engineering', FR: 'Génie Mécanique', ES: 'Ingeniería Mecánica', DE: 'Maschinenbau', ZH: '\u673a\u68b0\u5de5\u7a0b' },
  { value: 'electrical_eng',     EN: 'Electrical Engineering', FR: 'Génie Électrique', ES: 'Ingeniería Eléctrica', DE: 'Elektrotechnik', ZH: '\u7535\u6c14\u5de5\u7a0b' },
  { value: 'chemical_eng',       EN: 'Chemical Engineering', FR: 'Génie Chimique', ES: 'Ingeniería Química', DE: 'Chemieingenieurwesen', ZH: '\u5316\u5b66\u5de5\u7a0b' },
  { value: 'civil_eng',          EN: 'Civil Engineering', FR: 'Génie Civil', ES: 'Ingeniería Civil', DE: 'Bauingenieurwesen', ZH: '\u571f\u6728\u5de5\u7a0b' },
  { value: 'aerospace_eng',      EN: 'Aerospace Engineering', FR: 'Génie Aérospatial', ES: 'Ingeniería Aeroespacial', DE: 'Luft- und Raumfahrttechnik', ZH: '\u822a\u7a9a\u822a\u5929\u5de5\u7a0b' },
  { value: 'materials_science',  EN: 'Materials Science', FR: 'Science des Matériaux', ES: 'Ciencia de Materiales', DE: 'Materialwissenschaft', ZH: '\u6750\u6599\u79d1\u5b66' },
  { value: 'environmental_sci',  EN: 'Environmental Science', FR: "Sciences de l'Environnement", ES: 'Ciencias Ambientales', DE: 'Umweltwissenschaften', ZH: '\u7269\u7406\u73af\u5883\u5b66' },
  { value: 'management',         EN: 'Business Management', FR: 'Gestion des Affaires', ES: 'Administración de Empresas', DE: 'Betriebswirtschaftslehre', ZH: '\u5de5\u5546\u7ba1\u7406' },
  { value: 'finance',            EN: 'Finance & Accounting', FR: 'Finance & Comptabilité', ES: 'Finanzas y Contabilidad', DE: 'Finanzwesen', ZH: '\u91d1\u878d\u4e0e\u4f1a\u8ba1' },
  { value: 'education',          EN: 'Pedagogy & Education', FR: 'Pédagogie & Éducation', ES: 'Pedagogía y Educación', DE: 'Pädagogik', ZH: '\u6559\u80b2\u5b66' },
  { value: 'social_sciences',    EN: 'Social Sciences', FR: 'Sciences Sociales', ES: 'Ciencias Sociales', DE: 'Sozialwissenschaften', ZH: '社会科学' },
  { value: 'humanities_letters', EN: 'Humanities / Letters', FR: 'Humanités / Lettres', ES: 'Humanidades y Letras', DE: 'Geisteswissenschaften / Geisteswissenschaften', ZH: '人文与文学' }
] as const;

export const normalizeLevel = (level: string | undefined | null): string => {
  if (!level) return 'L1';
  const clean = level.trim().toLowerCase();
  const matched = ACADEMIC_LEVELS.find(lvl => lvl.value.toLowerCase() === clean);
  if (matched) return matched.value;
  if (clean === 'l1') return 'L1';
  if (clean === 'l2') return 'L2';
  if (clean === 'l3') return 'L3';
  if (clean === 'm1') return 'M1';
  if (clean === 'm2') return 'M2';
  return clean;
};

export const formatCourseLevelGlobal = (level: string | undefined | null, lang: string) => {
  if (!level) return '101';
  return formatCourseLevel(level, lang);
};

export const getLevelLabel = (value: string, lang: string): string => {
  return formatCourseLevel(value, lang);
};

export const getDisciplineLabel = (value: string, lang: string): string => {
  const k = lang.toUpperCase();
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`op_lang_disciplines_${k}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[value]) return parsed[value];
        const lowerVal = value.toLowerCase();
        if (parsed[lowerVal]) return parsed[lowerVal];
        for (const key of Object.keys(parsed)) {
          if (key.toLowerCase() === lowerVal) return parsed[key];
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  const disc = DISCIPLINES.find(d => d.value === value || d.value.toLowerCase() === value.toLowerCase() || d.EN.toLowerCase() === value.toLowerCase());
  if (disc) {
    const key = k as keyof typeof disc;
    return (disc[key] as string) || disc.EN;
  }
  return value;
};

const batchTranslateTexts = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (texts.length === 0) return [];
  const targetLower = targetLang.toLowerCase();
  const batchSize = 25;
  const results: string[] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const joinedText = batch.join('\n');
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(joinedText)}`);
      if (res.ok) {
        const data = await res.json();
        const translatedJoined = data[0].map((x: any) => x[0]).join('');
        const translatedBatch = translatedJoined.split('\n');
        
        if (translatedBatch.length === batch.length) {
          for (let j = 0; j < batch.length; j++) {
            results.push(translatedBatch[j]?.trim() || batch[j]);
          }
        } else {
          console.warn(`[batchTranslateTexts] Batch length mismatch (${translatedBatch.length} vs ${batch.length}), falling back to item-by-item...`);
          const singleTranslations = await Promise.all(batch.map(async (text) => {
            try {
              const r = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLower}&dt=t&q=${encodeURIComponent(text)}`);
              if (r.ok) {
                const d = await r.json();
                return d[0].map((x: any) => x[0]).join('').trim();
              }
            } catch (e) {
              console.error(e);
            }
            return text;
          }));
          results.push(...singleTranslations);
        }
      } else {
        results.push(...batch);
      }
    } catch (err) {
      console.error("[batchTranslateTexts] error:", err);
      results.push(...batch);
    }
  }
  return results;
};

