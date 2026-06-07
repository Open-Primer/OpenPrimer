import path from 'path';
import fs from 'fs';

let envPath = '';
const cwd = process.cwd();

if (fs.existsSync(path.join(cwd, '.env.local'))) {
  envPath = path.join(cwd, '.env.local');
} else if (fs.existsSync(path.join(cwd, 'web', '.env.local'))) {
  envPath = path.join(cwd, 'web', '.env.local');
} else {
  const dirName = typeof __dirname !== 'undefined' ? __dirname : '';
  if (dirName) {
    envPath = path.resolve(dirName, '../.env.local');
  }
}
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
  console.log('✅ [ENV-LOADER] Loaded environment variables from .env.local');
} else {
  console.warn('⚠️ [ENV-LOADER] No .env.local file found.');
}
