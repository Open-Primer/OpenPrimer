/**
 * OpenPrimer Security & Anti-Abuse Utility Library
 * Provides input sanitization, prompt injection detection, spam filtering, and email validation.
 */

// Common disposable email domains used for spamming
const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com',
  'yopmail.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'maildrop.cc'
];

// Heuristics for prompt injection detection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(?:all\s+)?previous\s+instructions/i,
  /ignore\s+(?:the\s+)?above/i,
  /bypass\s+(?:safety|restrictions|guardrails)/i,
  /override\s+(?:the\s+)?prompt/i,
  /forget\s+(?:your\s+)?instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+a/i,
  /you\s+must\s+now\s+act\s+as/i,
  /forget\s+everything\s+you/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /assistant\s*:/i,
  /system\s*:/i,
  /user\s*:/i,
  /dan\s+mode/i,
  /do\s+anything\s+now/i
];

// Heuristics for feedback/message spam detection
const SPAM_PHRASES = [
  /cheap\s+viagra/i,
  /buy\s+bitcoin/i,
  /crypto\s+investment/i,
  /make\s+money\s+fast/i,
  /earn\s+\$\d+\s+daily/i,
  /seo\s+services/i,
  /increase\s+traffic/i,
  /casino\s+online/i,
  /gambling\s+site/i
];

/**
 * Escapes HTML characters to prevent Stored or Reflected XSS.
 */
export function sanitizeString(text: string): string {
  if (!text) return '';
  // 1. Strip HTML tags
  let clean = text.replace(/<\/?[^>]+(>|$)/g, '');
  // 2. Escape special HTML entities
  return clean
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Heuristically checks text for signs of LLM prompt injection.
 */
export function detectPromptInjection(text: string): boolean {
  if (!text) return false;
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Heuristically detects if text is likely contact form or feedback spam.
 */
export function isSpam(text: string): boolean {
  if (!text) return false;
  
  // 1. Check for spammy keyword phrases
  if (SPAM_PHRASES.some((pattern) => pattern.test(text))) {
    return true;
  }

  // 2. Excess links check (non-link fields having 3 or more links is suspicious)
  const linkCount = (text.match(/https?:\/\//gi) || []).length + (text.match(/www\./gi) || []).length;
  if (linkCount >= 3) {
    return true;
  }

  // 3. Repeating character patterns (e.g. "aaaaaaa", "!!!!!!!")
  if (/(.)\1{9,}/.test(text)) {
    return true;
  }

  return false;
}

/**
 * Validates email address format and checks against disposable email providers.
 */
export function validateEmail(email: string): { isValid: boolean; reason?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, reason: 'Email is required' };
  }

  const trimmed = email.trim().toLowerCase();
  
  // Basic email structure regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, reason: 'Invalid email address format' };
  }

  // Check domain against disposable email blacklist
  const domain = trimmed.split('@')[1];
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { isValid: false, reason: 'Disposable email addresses are not permitted' };
  }

  return { isValid: true };
}
