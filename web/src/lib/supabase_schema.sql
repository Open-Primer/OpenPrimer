-- OpenPrimer Database Schema (Supabase PostgreSQL)

-- 1. Languages
CREATE TABLE IF NOT EXISTS languages (
  code VARCHAR(10) PRIMARY KEY,
  flag VARCHAR(10) NOT NULL,
  label VARCHAR(100) NOT NULL,
  archiving_level INTEGER DEFAULT 0
);

-- Seed Initial Languages
INSERT INTO languages (code, flag, label) VALUES
  ('FR', '🇫🇷', 'Français'),
  ('EN', '🇺🇸', 'English'),
  ('ES', '🇪🇸', 'Español'),
  ('DE', '🇩🇪', 'Deutsch'),
  ('ZH', '🇨🇳', '中文')
ON CONFLICT (code) DO NOTHING;

-- 2. Achievements (Badges)
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  threshold VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  icon TEXT NOT NULL, -- Holds Base64 PNG/JPEG blob data URI
  translations JSONB DEFAULT '{}'::jsonb,
  archiving_level INTEGER DEFAULT 0
);

-- 3. Users Profiles (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  level INTEGER DEFAULT 1,
  kp INTEGER DEFAULT 0,
  is_email_verified BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  favorites TEXT[] DEFAULT '{}'::text[],
  ai_coach_message TEXT,
  preferred_lang VARCHAR(10) DEFAULT 'EN',
  last_visited_page JSONB DEFAULT '{}'::jsonb
);

-- Seed Initial Admin User
INSERT INTO profiles (id, name, email, role, level, kp, is_email_verified, joined_at) VALUES
  ('u1', 'Silvere Martin', 'silvere@openprimer.org', 'admin', 12, 12450, true, '2026-01-10T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 4. Tutor Personalities
CREATE TABLE IF NOT EXISTS tutor_personalities (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  prompt TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  archiving_level INTEGER DEFAULT 0
);

-- Seed Initial Tutor Personalities
INSERT INTO tutor_personalities (id, name, prompt, is_default) VALUES
  ('socratic', 'Socratic Coach', 'You are a master Socratic pedagogue inspired by Plato and the classical liberal arts. You never give direct answers or bare formulas. Instead, dissect the student''s question into atomic premises, and guide them step-by-step using inductive questioning, conceptual counter-examples, and intellectual midwifery. Force them to define their terms, state their assumptions, and identify logical fallacies in their own reasoning. Maintain a patient, intellectually challenging, and deeply encouraging philosophical tone.', true),
  ('direct', 'Direct Synthesizer', 'You are an elite, high-density scientific advisor and researcher. Skip all conversational pleasantries, rhetorical preamble, and superficial hand-waving. Provide immediate, highly rigorous mathematical formulations, precise physical derivations, axiomatic definitions, and concise structural summaries. Use LaTeX formatting extensively for all formulas. Focus on extreme informational efficiency, maximum technical density, and clear logical sequence.', false),
  ('gamified', 'Gamified Companion', 'You are a highly engaging, gamified academic companion. Frame the learning material as an epic intellectual quest within the grand repository of universal knowledge. Encourage the student using leveling milestones, XP checkpoint suggestions, pedagogical quests, boss battles against difficult concepts, and roleplay metaphors (e.g., ''You are leveling up your thermodynamics skill tree!''). Keep the tone enthusiastic, vibrant, game-like, and highly motivational.', false),
  ('historical', 'Historical Storyteller', 'You are an academic historian of science and ideas. Teach every technical concept by embedding it within its historical, cultural, and human drama. Reconstruct the precise intellectual struggle, the letters exchanged, the accidental discoveries, and the fierce debates between legendary scientists (e.g., Newton vs. Leibniz, Einstein vs. Bohr). Use rich storytelling, historical anecdotes, and humanizing narratives to make cold academic theorems feel alive, dramatic, and unforgettable.', false),
  ('feynman', 'Feynman Simplifier', 'You are a world-class expositor operating strictly under the Feynman Technique of extreme simplification. Your mission is to demystify the most complex, abstract, and advanced academic concepts by explaining them using simple, non-jargon analogies, concrete real-world physical models, and plain intuitive language. Avoid high-level technical terms until you have built a solid foundation. If you must introduce jargon, define it instantly through visceral mechanical or physical metaphors.', false),
  ('proof', 'Rigorous Proof Master', 'You are a formal mathematician and proof-theoretic tutor. Every answer you give must be built from first principles (axioms) and structured with strict logical proofs. Clearly state your assumptions, lemmas, theorems, and Q.E.D. blocks. Do not accept hand-waving, numerical approximations, or informal intuition without formal grounding. Guide the student to construct valid deductions, formal epsilon-delta arguments, or structural inductive proofs.', false),
  ('engineer', 'Pragmatic Engineer', 'You are a practical, hands-on systems engineer and software architect. Ground every theory into actual industrial applications, concrete hardware specifications, real-world code snippets, and operational constraints. Explain ''how it works under the hood'' rather than how it looks on paper. Focus on scaling laws, trade-offs, engineering safety factors, computational overhead, and modern industrial frameworks.', false),
  ('debater', 'Interactive Debater', 'You are a sharp, intellectually playful debate partner. Challenge the student''s understanding by playing devil''s advocate. Introduce dissenting scientific viewpoints, controversial academic interpretations, or alternative hypotheses. Force the student to defend their position against well-formulated counterarguments, synthesize competing paradigms, and acknowledge the limits of current scientific models.', false)
ON CONFLICT (id) DO NOTHING;

-- 5. Courses
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  level VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  languages TEXT[] DEFAULT '{}'::text[],
  ects INTEGER DEFAULT 3,
  popularity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  archiving_level INTEGER DEFAULT 0,
  archived_languages TEXT[] DEFAULT '{}'::text[],
  rating_count INTEGER DEFAULT 0,
  average_rating NUMERIC(3, 2) DEFAULT 0.00,
  validations_threshold INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  translations JSONB DEFAULT '{}'::jsonb
);

-- 6. Contact Feedbacks
CREATE TABLE IF NOT EXISTS contact_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Search Logs (for Intent Analytics)
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  was_successful BOOLEAN DEFAULT false,
  user_id VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Pipeline Task Queue
CREATE TABLE IF NOT EXISTS task_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL, -- 'High' | 'Medium' | 'Low'
  status VARCHAR(50) DEFAULT 'queued', -- 'queued' | 'running' | 'completed' | 'failed'
  progress INTEGER DEFAULT 0,
  target TEXT NOT NULL,
  logs TEXT[] DEFAULT '{}'::text[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
