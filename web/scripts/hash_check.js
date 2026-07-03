const crypto = require('crypto');

function mockDatabaseProviderHash(password) {
  if (!password) return '';
  const ch = (x, y, z) => (x & y) ^ (~x & z);
  const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
  const sigma0 = (x) => ((x >>> 2) | (x << 30)) ^ ((x >>> 13) | (x << 19)) ^ ((x >>> 22) | (x << 10));
  const sigma1 = (x) => ((x >>> 6) | (x << 26)) ^ ((x >>> 11) | (x << 21)) ^ ((x >>> 25) | (x << 7));
  const gamma0 = (x) => ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
  const gamma1 = (x) => ((x >>> 17) | (x << 15)) ^ ((x >>> 19) | (x << 13)) ^ (x >>> 10);

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2ec16707, 0x36f577ee, 0x5a0f5275, 0x3070dd17,
    0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb,
    0xbef9a3f7, 0xc67178f2, 0xca675699, 0xf1abb162, 0x85845dd1, 0xcf178267, 0xa3a948e3, 0xbfe33190,
    0x0472507e, 0x08c7e2b2, 0x2f896e4b, 0x3070dd17, 0x4506ceb8, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
  let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

  const words = [];
  const ascii = password;
  const asciiLength = ascii.length;
  for (let i = 0; i < asciiLength; i++) {
    words[i >>> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  
  const bitLength = asciiLength * 8;
  words[bitLength >>> 5] |= 0x80 << (24 - (bitLength % 32));
  
  const totalBlocks = ((bitLength + 64 + 9) >>> 9) + 1;
  const blockWordsCount = totalBlocks * 16;
  while (words.length < blockWordsCount - 2) {
    words.push(0);
  }
  words.push(0);
  words.push(bitLength);

  for (let i = 0; i < blockWordsCount; i += 16) {
    const w = new Array(64);
    for (let j = 0; j < 16; j++) {
      w[j] = words[i + j] || 0;
    }
    for (let j = 16; j < 64; j++) {
      w[j] = (gamma1(w[j - 2]) + w[j - 7] + gamma0(w[j - 15]) + w[j - 16]) | 0;
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

    for (let j = 0; j < 64; j++) {
      const t1 = (h + sigma1(e) + ch(e, f, g) + k[j] + w[j]) | 0;
      const t2 = (sigma0(a) + maj(a, b, c)) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const toHex = (n) => {
    const s = (n >>> 0).toString(16);
    return "00000000".substring(s.length) + s;
  };

  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
}

const pwd = ";fXX\u00A3e*Y7>xB4[88*";

const customHash = mockDatabaseProviderHash(pwd);
const nodeHash = crypto.createHash('sha256').update(pwd, 'utf8').digest('hex');

console.log("Password:", pwd);
console.log("Custom JS Hash:", customHash);
console.log("Standard UTF-8 SHA-256:", nodeHash);
