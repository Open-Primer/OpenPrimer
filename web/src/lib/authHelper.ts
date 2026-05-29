import { supabase } from './supabase';

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

/**
 * Verifies standard Supabase JWT token received inside the HTTP Authorization header.
 * Automatically handles offline/sandbox mode cleanly when database credentials are not configured or are set to placeholders.
 */
export async function verifySession(request: Request): Promise<AuthenticatedUser | null> {
  const isOfflineMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');
  
  if (isOfflineMode) {
    console.log('[AUTH MOCK] Permitting offline/sandbox mock developer credentials.');
    return { id: 'mock-offline-user-id', email: 'mock@openprimer.org' };
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.warn('[AUTH ERROR] Supabase token verification failed:', error?.message);
      return null;
    }
    return user;
  } catch (err) {
    console.error('[AUTH EXCEPTION] Failed to verify token:', err);
    return null;
  }
}
