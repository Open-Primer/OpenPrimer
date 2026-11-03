import { supabaseAdmin } from '../supabase';

const mediaValidationCache = new Map<string, boolean>();

export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function uploadToSupabaseStorage(fileName: string, buffer: Buffer, contentType: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('media')
      .upload(`public/${fileName}`, buffer, {
        contentType,
        upsert: true
      });

    if (error) {
      console.warn(`[SUPABASE STORAGE] Upload failed for ${fileName}:`, error.message);
      return null;
    }

    const { data: publicData } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(`public/${fileName}`);

    return publicData.publicUrl;
  } catch (err) {
    console.warn(`[SUPABASE STORAGE] Error uploading ${fileName}:`, err);
    return null;
  }
}

export async function validateMediaUrl(url: string): Promise<boolean> {
  if (!url) return false;
  if (mediaValidationCache.has(url)) return mediaValidationCache.get(url)!;

  try {
    const res = await fetchWithTimeout(url, { method: 'HEAD' }, 5000);
    const valid = res.ok;
    mediaValidationCache.set(url, valid);
    return valid;
  } catch (e) {
    mediaValidationCache.set(url, false);
    return false;
  }
}
