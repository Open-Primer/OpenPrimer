const fs = require('fs');
const path = require('path');

const mockCourses = [
  { 
    id: 103, 
    title: "Fundamentos de la Filosofía", 
    slug: "Fundamentos_de_la_Filosofia", 
    level: "L1", 
    subject: "Philosophy", 
    description: "Un viaje sistemático y avanzado a través de las cuestiones centrales de la existencia, el conocimiento, la ética y la metafísica.", 
    languages: ["es"], 
    ects: 6, 
    popularity: 1200, 
    is_active: true,
    isCurriculum: false,
    childCourses: [],
    translations: {
      ES: { title: "Fundamentos de la Filosofía", description: "Un viaje sistemático y avanzado a través de las cuestiones centrales de la existencia, el conocimiento, la ética y la metafísica." }
    }
  },
  { 
    id: 112, 
    title: "Introduction à l'Économie Comportementale", 
    slug: "Introduction_a_l_Economie_Comportementale", 
    level: "L1", 
    subject: "Économie", 
    description: "Une exploration captivante de la psychologie des décisions économiques, remettant en question l'hypothèse de l'agent rationnel à travers les biais cognitifs, les heuristiques et la théorie des perspectives.", 
    languages: ["fr"], 
    ects: 6, 
    popularity: 1500, 
    is_active: true,
    isCurriculum: false,
    childCourses: [],
    translations: {
      FR: { title: "Introduction à l'Économie Comportementale", description: "Une exploration captivante de la psychologie des décisions économiques, remettant en question l'hypothèse de l'agent rationnel à travers les biais cognitifs, les heuristiques et la théorie des perspectives." }
    }
  }
];

let sql = `-- OpenPrimer Real Generated Courses Seed Data\n`;
sql += `TRUNCATE TABLE public.courses CASCADE;\n\n`;

mockCourses.forEach(c => {
  const languagesStr = `ARRAY[` + c.languages.map(l => `'${l}'`).join(', ') + `]::TEXT[]`;
  const childCoursesStr = `ARRAY[` + (c.childCourses || []).map(id => id).join(', ') + `]::INTEGER[]`;
  const translationsJson = JSON.stringify(c.translations || {});
  
  sql += `INSERT INTO public.courses (
    id, title, slug, level, subject, description, languages, ects, popularity, is_active, 
    is_curriculum, child_courses, translations
  ) VALUES (
    ${c.id}, 
    '${c.title.replace(/'/g, "''")}', 
    '${c.slug}', 
    '${c.level}', 
    '${c.subject}', 
    '${c.description.replace(/'/g, "''")}', 
    ${languagesStr}, 
    ${c.ects}, 
    ${c.popularity}, 
    ${c.is_active}, 
    ${c.isCurriculum || false}, 
    ${childCoursesStr}, 
    '${translationsJson.replace(/'/g, "''")}'::JSONB
  ) ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    level = EXCLUDED.level,
    subject = EXCLUDED.subject,
    description = EXCLUDED.description,
    languages = EXCLUDED.languages,
    ects = EXCLUDED.ects,
    popularity = EXCLUDED.popularity,
    is_active = EXCLUDED.is_active,
    is_curriculum = EXCLUDED.is_curriculum,
    child_courses = EXCLUDED.child_courses,
    translations = EXCLUDED.translations;\n\n`;
});

// Write to supabase_seed.sql
const seedPath = path.join(__dirname, 'src', 'lib', 'supabase_seed.sql');
fs.writeFileSync(seedPath, sql, 'utf8');
console.log(`✅ Generated seed SQL in ${seedPath}`);
