import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- PROFILE HELPERS ---
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

// --- PROGRESS HELPERS ---
export const saveProgress = async (userId: string, courseId: string, sectionId: string) => {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, course_id: courseId, section_id: sectionId, status: 'completed', last_accessed: new Date() });
  return { data, error };
};

// --- BADGE HELPERS ---
export const unlockBadge = async (userId: string, label: string, icon: string) => {
  const { data, error } = await supabase
    .from('badges')
    .insert({ user_id: userId, label, icon });
  return { data, error };
};
