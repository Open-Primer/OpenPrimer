import './env-loader';

import path from 'path';
import fs from 'fs';
import { generateCurriculum } from '../src/lib/ai';
import { dbService } from '../src/lib/db';

const disciplines = [
  { name: 'Physique L1', slug: 'physique_l1' },
  { name: 'Mathématiques L1', slug: 'mathematiques_l1' },
  { name: 'Chimie L1', slug: 'chimie_l1' },
  { name: 'Informatique L1', slug: 'informatique_l1' },
  { name: 'Biologie L1', slug: 'biologie_l1' }
];

async function run() {
  console.log('🚀 Starting Agent 0 L1 Curriculum Generation (Supabase Production Database)...');
  const results: any[] = [];

  for (const disc of disciplines) {
    console.log(`\n===========================================`);
    console.log(`⏳ Generating Curriculum for: "${disc.name}"...`);
    console.log(`===========================================`);
    
    try {
      // Run Agent 0 Curriculum planner
      await generateCurriculum(disc.name, 'L1', 'fr');
      
      console.log(`\n🎉 Completed Agent 0 generation for "${disc.name}". Fetching results from DB...`);

      // Retrieve parent curriculum metadata
      const coursesRes = await dbService.getAllCourses();
      const curriculum = coursesRes.data?.find(c => c.slug === disc.slug);

      if (!curriculum) {
        console.error(`❌ Error: Curriculum for "${disc.name}" not found in database.`);
        continue;
      }

      // Retrieve associated queued course tasks
      const queueRes = await dbService.getPipelineQueue();
      const childTasks = (queueRes.data || []).filter(
        (task: any) => task.parentCurriculumSlug === disc.slug
      );

      console.log(`\n📚 Curriculum Title: ${curriculum.title}`);
      console.log(`📝 Description: ${curriculum.description}`);
      console.log(`📂 Level: ${curriculum.level} | Languages: ${curriculum.languages?.join(', ')}`);
      console.log(`📖 Planned Modules Count: ${childTasks.length}`);
      
      console.log(`\n📋 Planned Course Modules:`);
      const modules = childTasks.map((task: any, idx: number) => {
        console.log(`  [Module ${idx + 1}]`);
        console.log(`  - Title: ${task.title}`);
        console.log(`  - Subject: ${task.subject}`);
        console.log(`  - Type: ${task.courseType || 'N/A'}`);
        console.log(`  - Volume: ${task.volume || 'N/A'}`);
        console.log(`  - Description: ${task.description}`);
        return {
          title: task.title,
          subject: task.subject,
          type: task.courseType,
          volume: task.volume,
          description: task.description
        };
      });

      results.push({
        curriculum: {
          id: curriculum.id,
          title: curriculum.title,
          slug: curriculum.slug,
          description: curriculum.description,
          level: curriculum.level,
          languages: curriculum.languages,
          modulesCount: childTasks.length
        },
        modules
      });

    } catch (err: any) {
      console.error(`❌ Failed to generate curriculum for "${disc.name}":`, err.message || err);
    }
  }

  // Ensure scratch directory exists
  const scratchDir = path.resolve(__dirname, '../scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  // Save results to scratch JSON file
  const outPath = path.join(scratchDir, 'generated_l1_curriculums.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n🎉 All done! Saved combined curriculums to ${outPath}`);
}

run().catch(console.error);
