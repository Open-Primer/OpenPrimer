-- OPENPRIMER VERSIONING & FEEDBACK SCHEMA (v47.0)

-- 1. Course Versions
CREATE TABLE IF NOT EXISTS course_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
  version_number TEXT NOT NULL, -- e.g. "1.1.2"
  content_snapshot_path TEXT, -- Path to directory or ZIP
  status TEXT DEFAULT 'draft', -- 'draft', 'reviewing', 'live', 'archived'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  is_elite_certified BOOLEAN DEFAULT false
);

-- 2. User Reports (Feedback)
CREATE TABLE IF NOT EXISTS user_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  curriculum_id UUID REFERENCES curricula(id),
  module_id TEXT,
  content TEXT NOT NULL,
  category TEXT, -- 'error', 'clarity', 'depth', 'other'
  status TEXT DEFAULT 'pending', -- 'pending', 'analyzed', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Diagnostic Summaries (AI Driven)
CREATE TABLE IF NOT EXISTS diagnostic_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  curriculum_id UUID REFERENCES curricula(id),
  summary_text TEXT,
  proposed_fixes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Update Curricula with Auto-Revision settings
ALTER TABLE curricula ADD COLUMN IF NOT EXISTS auto_revision BOOLEAN DEFAULT false;
ALTER TABLE curricula ADD COLUMN IF NOT EXISTS current_version_id UUID REFERENCES course_versions(id);
