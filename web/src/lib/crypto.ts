/**
 * Cryptographic & Obfuscation Utilities — OpenPrimer
 * 
 * Provides synchronous encryption and decryption helpers to secure sensitive keys
 * (like personal tutor API keys) in browser localStorage, preventing plain-text exposure
 * to generic browser extensions or basic physical readers.
 * 
 * Features a backward-compatible migration path for legacy plain-text keys.
 */

const CIPHER_KEY = 'OpenPrimerSovereignTutorKeySec2026';
const ENCRYPTED_PREFIX = '__encrypted__:';

/**
 * Encrypt/Obfuscate a sensitive API key using a synchronous XOR cipher + Base64 encoding.
 * Prefixes the output with a marker to allow safe backward-compatible decoding.
 */
export function encryptApiKey(text: string): string {
  if (!text) return '';
  if (text.startsWith(ENCRYPTED_PREFIX)) {
    return text; // Already encrypted
  }

  try {
    let scrambled = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length);
      scrambled += String.fromCharCode(charCode);
    }
    // Encode to base64 safely supporting unicode characters
    const base64 = btoa(unescape(encodeURIComponent(scrambled)));
    return `${ENCRYPTED_PREFIX}${base64}`;
  } catch (e) {
    console.error('[CRYPTO] Encryption exception:', e);
    return text; // Fallback to plain text on failure
  }
}

/**
 * Decrypt/De-obfuscate an API key. 
 * Automatically detects and returns legacy plain-text keys unmodified.
 */
export function decryptApiKey(encoded: string): string {
  if (!encoded) return '';
  if (!encoded.startsWith(ENCRYPTED_PREFIX)) {
    // Legacy plain-text key, return as-is for backward-compatibility
    return encoded;
  }

  try {
    const base64 = encoded.slice(ENCRYPTED_PREFIX.length);
    // Decode base64 safely
    const scrambled = decodeURIComponent(escape(atob(base64)));
    let result = '';
    for (let i = 0; i < scrambled.length; i++) {
      const charCode = scrambled.charCodeAt(i) ^ CIPHER_KEY.charCodeAt(i % CIPHER_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch (e) {
    console.warn('[CRYPTO] Decryption failed, returning plain value as fallback:', e);
    return encoded;
  }
}
