import path from 'path';
import fs from 'fs';

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const index = trimmed.indexOf('=');
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

import { dbService } from '../src/lib/db';

async function run() {
  console.log('Testing savePipelineQueue...');
  const testTask = {
    id: 'not-a-uuid',
    title: 'Test Course Task',
    type: 'generation',
    status: 'queued',
    priority: 'High',
    progress: 0,
    level: 'L1',
    targetLang: 'fr',
    subject: 'Maths',
    parentCurriculumSlug: 'math_l1',
    courseType: 'mandatory',
    volume: '30h',
    description: 'This is a test task description.'
  };

  const res = await dbService.savePipelineQueue([testTask]);
  console.log('Result:', res);
  
  const getRes = await dbService.getPipelineQueue();
  console.log('Get queue result:', getRes);
}

run().catch(console.error);
