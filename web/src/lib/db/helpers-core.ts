import {
  isDatabaseConfigured,
  isSandboxFallbackAllowed,
  setDynamicOffline,
  users
} from './state-store';

export const isConnectionFailure = (error: any): boolean => {
  if (!error) return false;
  if (error.code) {
    const codeStr = String(error.code);
    if (codeStr.startsWith('PGRST') || /^[0-9A-Z]{5}$/.test(codeStr)) {
      return false;
    }
  }
  const errMsg = (error?.message || String(error)).toLowerCase();
  const isNetwork = 
    (typeof navigator !== 'undefined' && !navigator.onLine) ||
    errMsg.includes("fetch") || 
    errMsg.includes("network") || 
    errMsg.includes("timeout") || 
    errMsg.includes("offline") ||
    errMsg.includes("failed to fetch") ||
    errMsg.includes("load failed") ||
    errMsg.includes("connection refused") ||
    errMsg.includes("dns") ||
    error?.status === 0 ||
    error?.status === 502 ||
    error?.status === 503 ||
    error?.status === 504;
  return !!isNetwork;
};

export const handleDatabaseError = (error: any) => {
  if (error?.code === 'PGRST116') {
    return;
  }

  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost && isSandboxFallbackAllowed() && isConnectionFailure(error)) {
    console.warn("⚠️ [DATABASE FALLBACK] Supabase connection failed. Falling back to LocalStorage mock provider on localhost:", error);
    setDynamicOffline(true);
    return;
  }

  if (isDatabaseConfigured && !error?.code?.startsWith('PGRST') && error?.code !== 'PGRST116') {
    console.error("❌ [DATABASE CONNECTION FAILURE] Supabase query failed:", error);
  }
  if (typeof window !== 'undefined') {
    if (isConnectionFailure(error)) {
      window.dispatchEvent(new CustomEvent('op_database_connection_failure', {
        detail: { message: error?.message || String(error) }
      }));
    }
  }
};

export const getCanonicalCourseId = (slugOrId: string | number): number => {
  if (typeof slugOrId === 'number') return slugOrId;
  const s = String(slugOrId).toLowerCase().replace(/_/g, '-');
  if (s === 'classical-mechanics' || s === '1') return 1;
  if (s === 'quantum-physics' || s === 'physique-test-l2' || s === '2') return 2;
  if (s === 'cell-biology' || s === 'biologie-test' || s === '3') return 3;
  if (s === 'molecular-genetics' || s === 'biologie-test-l1' || s === '4') return 4;
  if (s === 'constitutional-law' || s === 'droit-test' || s === '5') return 5;
  if (s === 'criminal-law' || s === 'droit-test-l2' || s === '6') return 6;
  if (s === 'linear-algebra' || s === 'maths-test' || s === '7') return 7;
  if (s === 'calculus-i' || s === 'maths-test-l1' || s === '8') return 8;
  if (s === 'organic-chemistry' || s === 'chimie-test' || s === '9') return 9;
  if (s === 'microeconomics' || s === 'economie-test' || s === '10') return 10;
  if (s === 'statistics' || s === 'statistics-l1' || s === '11') return 11;
  if (s === 'sovereign-ai-curriculum' || s === '12') return 12;
  if (s === 'biologie-cellulaire-l1' || s === 'biologie_cellulaire_l1' || s === '13') return 13;
  if (s === 'genetique-moleculaire-l1' || s === 'genetique_moleculaire_l1' || s === '14') return 14;
  if (s === 'biochimie-structurale-l1' || s === 'biochimie_structurale_l1' || s === '15') return 15;
  if (s === 'microbiologie-l1' || s === 'microbiologie_l1' || s === '16') return 16;
  if (s === 'ecologie-generale-l1' || s === 'ecologie_generale_l1' || s === '17') return 17;
  if (s === 'bio-l1-fondamentaux' || s === 'bio_l1_fondamentaux' || s === '18') return 18;
  if (s === 'sciences-l1-tronc-commun' || s === 'sciences_l1_tronc_commun' || s === '19') return 19;
  
  const parsed = parseInt(String(slugOrId));
  if (!isNaN(parsed)) return parsed;
  return 0;
};

export const authService = {
  getUser: () => users[0], 
  login: (email: string) => console.log(`Logging in ${email}...`),
  logout: () => console.log("Logging out..."),
  isAdmin: () => users[0].role === 'admin'
};

export function getLocalizedCourseTitleInternal(course: any, lang: string) {
  if (!course) return '';
  const code = (lang || 'EN').toUpperCase();
  if (course.translations && course.translations[code]) {
    const t = course.translations[code];
    return t.title || t.name || course.title || course.name || '';
  }
  if (course.translations && course.translations['EN']) {
    const t = course.translations['EN'];
    return t.title || t.name || course.title || course.name || '';
  }
  return course.title || course.name || '';
}


export function mockDatabaseProviderHash(password: string): string {
  if (!password) return '';
  const rightRotate = (value: number, amount: number): number => {
    return (value >>> amount) | (value << (32 - amount));
  };
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i: number, j: number;

  let result = '';

  const words: number[] = [];
  const hash: number[] = [];

  let primeCounter = 0;
  const isComposite: { [key: number]: number } = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = 1;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      primeCounter++;
    }
  }
  
  // Convert to UTF-8 bytes:
  const bytes: number[] = [];
  for (i = 0; i < password[lengthProperty]; i++) {
    let code = password.charCodeAt(i);
    if (code < 128) {
      bytes.push(code);
    } else if (code < 2048) {
      bytes.push((code >> 6) | 192);
      bytes.push((code & 63) | 128);
    } else if (
      (code & 0xF800) === 0xD800 &&
      i + 1 < password[lengthProperty] &&
      (password.charCodeAt(i + 1) & 0xFC00) === 0xDC00
    ) {
      code = 0x10000 + ((code & 0x3FF) << 10) + (password.charCodeAt(++i) & 0x3FF);
      bytes.push((code >> 18) | 240);
      bytes.push(((code >> 12) & 63) | 128);
      bytes.push(((code >> 6) & 63) | 128);
      bytes.push((code & 63) | 128);
    } else {
      bytes.push((code >> 12) | 224);
      bytes.push(((code >> 6) & 63) | 128);
      bytes.push((code & 63) | 128);
    }
  }

  const byteLength = bytes[lengthProperty];
  for (i = 0; i < byteLength; i++) {
    words[i >>> 2] |= (bytes[i] & 0xff) << (24 - (i % 4) * 8);
  }
  
  const bitLength = byteLength * 8;
  words[bitLength >>> 5] |= 0x80 << (24 - (bitLength % 32));
  
  words[((bitLength + 64 >>> 9) << 4) + 15] = bitLength;
  
  // Standard K constants (first 64 primes cube roots fractional parts)
  const k: number[] = [];
  primeCounter = 0;
  const isCompositeK: { [key: number]: number } = {};
  for (let candidateK = 2; primeCounter < 64; candidateK++) {
    if (!isCompositeK[candidateK]) {
      for (i = 0; i < 313; i += candidateK) {
        isCompositeK[i] = 1;
      }
      k[primeCounter] = (mathPow(candidateK, 1/3) * maxWord) | 0;
      primeCounter++;
    }
  }

  for (let blockStart = 0; blockStart < words[lengthProperty]; blockStart += 16) {
    const w: number[] = [];
    let working = hash.slice(0);
    for (i = 0; i < 64; i++) {
      if (i < 16) {
        w[i] = words[blockStart + i] || 0;
      } else {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      
      const a = working[0], b = working[1], c = working[2], d = working[3];
      const e = working[4], f = working[5], g = working[6], h = working[7];
      
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      
      const chVal = (e & f) ^ (~e & g);
      const majVal = (a & b) ^ (a & c) ^ (b & c);
      
      const temp1 = (h + S1 + chVal + k[i] + w[i]) | 0;
      const temp2 = (S0 + majVal) | 0;
      
      working = [(temp1 + temp2) | 0, a, b, c, (d + temp1) | 0, e, f, g];
    }
    
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + working[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    const n = hash[i];
    for (j = 0; j < 4; j++) {
      const v = (n >>> (24 - j * 8)) & 0xff;
      result += (v < 16 ? '0' : '') + v.toString(16);
    }
  }
  return result;
}
