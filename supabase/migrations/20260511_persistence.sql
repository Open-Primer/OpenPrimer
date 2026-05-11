-- OPENPRIMER INDUSTRIAL SCHEMA (v41.0)

-- 1. Profiles (Enhanced)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  academic_level TEXT DEFAULT 'L1',
  preferred_lang TEXT DEFAULT 'EN',
  avatar_url TEXT,
  rewards_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Badges
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  icon TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tutor History (Limited Retention)
CREATE TABLE IF NOT EXISTS tutor_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  messages JSONB NOT NULL, -- Store array of {role, content}
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Course Ratings
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  UNIQUE(user_id, course_id)
);

-- 5. User Progress (Persistent)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  section_id TEXT,
  status TEXT DEFAULT 'started', -- 'started', 'completed'
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
