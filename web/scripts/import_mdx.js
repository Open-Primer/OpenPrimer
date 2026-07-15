const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Monkey patch js-yaml v4 compatibility for gray-matter which still calls the deprecated/removed safeLoad
const yaml = require('js-yaml');
if (yaml) {
  try {
    Object.defineProperty(yaml, 'safeLoad', {
      value: yaml.load,
      writable: true,
      configurable: true
    });
  } catch (e) {
    yaml.safeLoad = yaml.load;
  }
}

const matter = require('gray-matter');

// Load environment variables
function parseEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}

parseEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const CONTENT_PATH = path.join(__dirname, '../content');

async function importMdxFiles(dir = '') {
  const fullPath = path.join(CONTENT_PATH, dir);
  if (!fs.existsSync(fullPath)) return;

  const items = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const item of items) {
    const relPath = path.join(dir, item.name).split(path.sep).join('/');
    if (item.isDirectory()) {
      await importMdxFiles(relPath);
    } else if (item.name.endsWith('.mdx')) {
      // Parse course, level, subject, lesson slugs and language
      // Format: [level]/[subject]/[courseSlug]/[lessonSlug].[lang].mdx
      const parts = relPath.split('/');
      if (parts.length >= 4) {
        const level = parts[0];
        const subject = parts[1];
        const courseSlug = parts[2];
        const fileName = parts[parts.length - 1];
        
        // Extract language and lesson slug
        const matches = fileName.match(/^(.*?)\.([a-z]{2})\.mdx$/i);
        if (matches) {
          const lessonSlug = matches[1];
          const lang = matches[2].toLowerCase();
          
          const fileContent = fs.readFileSync(path.join(CONTENT_PATH, relPath), 'utf-8');
          let frontmatter = {};
          let title = lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          let order = null;
          
          try {
            const parsed = matter(fileContent);
            frontmatter = parsed.data || {};
            if (frontmatter.title) {
              title = frontmatter.title;
            }
            if (frontmatter.order !== undefined && frontmatter.order !== null) {
              order = Number(frontmatter.order);
            }
          } catch (yamlErr) {
            console.warn(`⚠️ Warning: Failed to parse frontmatter for ${relPath}: ${yamlErr.message}. Importing with fallback metadata.`);
          }

          console.log(`⏳ Importing [${lang.toUpperCase()}] ${courseSlug} -> ${lessonSlug} (order: ${order})...`);

          const { error } = await supabase
            .from('lessons')
            .upsert(
              {
                course_slug: courseSlug,
                lesson_slug: lessonSlug,
                lang: lang,
                title: title,
                content: fileContent,
                order: order
              },
              { onConflict: 'course_slug,lesson_slug,lang' }
            );

          if (error) {
            console.error(`🚨 Failed to import ${relPath}:`, error.message);
          } else {
            console.log(`✅ Imported ${lessonSlug} (${lang}) successfully.`);
          }
        }
      }
    }
  }
}

async function run() {
  console.log("🚀 Starting MDX Content import into Supabase lessons table...");
  if (!fs.existsSync(CONTENT_PATH)) {
    console.log("📂 No local content folder found. Skipping import.");
    return;
  }
  await importMdxFiles();
  console.log("🎉 Content import completed!");
}

run();
