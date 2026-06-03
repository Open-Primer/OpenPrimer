function mockDatabaseProviderHash(password) {
  if (!password) return '';
  const rightRotate = (value, amount) => {
    return (value >>> amount) | (value << (32 - amount));
  };
  
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i, j;

  let result = '';

  const words = [];
  const hash = [];

  let primeCounter = 0;
  const isComposite = {};
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
  const bytes = [];
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
  const k = [];
  primeCounter = 0;
  const isCompositeK = {};
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
    const w = [];
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

console.log("HASH FOR ';fXX£e*Y7>xB4[88*':", mockDatabaseProviderHash(';fXX£e*Y7>xB4[88*'));
