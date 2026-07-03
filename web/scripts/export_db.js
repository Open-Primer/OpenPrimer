/**
 * OpenPrimer Database Exporter Script
 * Exports core open-source pedagogical content (courses, lessons, achievements, personalities)
 * while completely scrubbing and excluding user profiles, progress, and private data.
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
} catch (e) {
  // dotenv might not be installed, we can fall back to process.env directly
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("⚠️ Warning: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY are not defined.");
  console.warn("⚠️ Database export will be skipped, and a placeholder seed file will be written to prevent build crashes.");
  
  const outputPath = path.join(__dirname, '../src/lib/supabase_seed.sql');
  const placeholderSql = `-- =========================================================\n`
    + `-- OPENPRIMER DATABASE SEED FILE (PLACEHOLDER)\n`
    + `-- Skipped due to missing environment variables during build\n`
    + `-- =========================================================\n`;
  
  fs.writeFileSync(outputPath, placeholderSql, 'utf-8');
  console.log(`🎉 Placeholder seed written to ${outputPath}`);
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function exportTableToSql(tableName, pkeyCols = ['id']) {
  console.log(`⏳ Exporting table "${tableName}"...`);
  const { data, error } = await supabase.from(tableName).select('*');
  if (error) {
    console.error(`🚨 Error querying table ${tableName}:`, error.message);
    return `-- ERROR EXPORTING ${tableName}: ${error.message}\n`;
  }

  if (!data || data.length === 0) {
    return `-- TABLE ${tableName} was empty.\n\n`;
  }

  let sql = `-- Core content seed for ${tableName}\n`;
  for (const row of data) {
    const columns = Object.keys(row);
    const values = Object.values(row).map(val => {
      if (val === null) return 'NULL';
      if (typeof val === 'object') {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
      }
      if (typeof val === 'string') {
        return `'${val.replace(/'/g, "''")}'`;
      }
      return val;
    });

    const colStr = columns.join(', ');
    const valStr = values.join(', ');
    
    // Build upsert statement (using ON CONFLICT)
    const conflictTargets = pkeyCols.join(', ');
    const updates = columns
      .filter(col => !pkeyCols.includes(col))
      .map(col => `${col} = EXCLUDED.${col}`)
      .join(', ');

    sql += `INSERT INTO public.${tableName} (${colStr}) VALUES (${valStr})\n`;
    if (updates.length > 0) {
      sql += `ON CONFLICT (${conflictTargets}) DO UPDATE SET ${updates};\n`;
    } else {
      sql += `ON CONFLICT (${conflictTargets}) DO NOTHING;\n`;
    }
  }
  sql += '\n';
  return sql;
}

async function run() {
  console.log("🚀 Initializing OpenPrimer Database Exporter...");
  
  let seedSql = `-- =========================================================\n`;
  seedSql += `-- OPENPRIMER OPEN-SOURCE DATABASE SEED FILE\n`;
  seedSql += `-- Generated on: ${new Date().toISOString()}\n`;
  seedSql += `-- Excludes all sensitive user tables (profiles, user_progress, feedbacks)\n`;
  seedSql += `-- =========================================================\n\n`;

  // Export tables
  seedSql += await exportTableToSql('courses', ['id']);
  seedSql += await exportTableToSql('lessons', ['course_slug', 'lesson_slug', 'lang']);
  seedSql += await exportTableToSql('achievements', ['id']);
  seedSql += await exportTableToSql('tutor_personalities', ['id']);

  const outputPath = path.join(__dirname, '../src/lib/supabase_seed.sql');
  fs.writeFileSync(outputPath, seedSql, 'utf-8');
  console.log(`\n🎉 Success! Public open-source database seed successfully generated at:\n👉 ${outputPath}\n`);
  console.log("💡 You can now commit and push this file to GitHub safely!");
}

run();
