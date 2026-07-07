import * as fs from 'fs';
import * as path from 'path';

// Load env variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

import { resolveAndPersistMedia } from '../src/lib/media-resolver';

async function run() {
  const testMdx = `
## Test Section
Dès l'Antiquité, des civilisations ont développé des méthodes systématiques.
L'un des exemples les plus emblématiques est l'algorithme d'Euclide, décrit dans ses Éléments vers 300 av. J.-C. <RealPerson id="euclide">Euclide</RealPerson> y propose une méthode.
Le terme « algorithme » lui-même nous vient du nom d'un mathématicien perse du IXe siècle, <RealPerson id="al-khwarizmi">Al-Khwarizmi</RealPerson>.
  `;
  
  console.log('--- BEFORE RESOLUTION ---');
  console.log(testMdx);
  
  console.log('--- RESOLVING... ---');
  const resolved = await resolveAndPersistMedia(testMdx, 'fr');
  
  console.log('--- AFTER RESOLUTION ---');
  console.log(resolved);
}

run().catch(console.error);
