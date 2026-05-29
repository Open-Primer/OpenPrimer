const cp1252Map = {
  '\u20AC': 0x80, '\u201A': 0x82, '\u0192': 0x83, '\u201E': 0x84, '\u2026': 0x85,
  '\u2020': 0x86, '\u2021': 0x87, '\u02C6': 0x88, '\u2030': 0x89, '\u0160': 0x8A,
  '\u2039': 0x8B, '\u0152': 0x8C, '\u017D': 0x8E, '\u2018': 0x91, '\u2019': 0x92,
  '\u201C': 0x93, '\u201D': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
  '\u02DC': 0x98, '\u2122': 0x99, '\u0161': 0x9A, '\u203A': 0x9B, '\u0153': 0x9C,
  '\u017E': 0x9E, '\u0178': 0x9F
};

function getByte(char) {
  if (cp1252Map[char] !== undefined) {
    return cp1252Map[char];
  }
  return char.charCodeAt(0);
}

function decodeString(str) {
  // 1. Match double-encoded characters in Windows-1252/Latin1 byte ranges
  // We can match any sequence of 3 characters that represents a 3-byte UTF-8 character:
  // E0-EF followed by 80-BF followed by 80-BF
  let result = str.replace(/([\u00E0-\u00EF])([\u0080-\u00BF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178])([\u0080-\u00BF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178])/g, (match, c1, c2, c3) => {
    const bytes = [getByte(c1), getByte(c2), getByte(c3)];
    return Buffer.from(bytes).toString('utf8');
  });

  // 2. Decode 2-byte UTF-8 sequences (like French/Spanish/German accented characters)
  result = result.replace(/([\u00C2-\u00DF])([\u0080-\u00BF\u20AC\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u017D\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u017E\u0178])/g, (match, c1, c2) => {
    const bytes = [getByte(c1), getByte(c2)];
    return Buffer.from(bytes).toString('utf8');
  });

  return result;
}

const tests = [
  "å¤§ä¸€",
  "FranÃ§ais",
  "MÃ©canique Classique",
  "å½“å‰ è¯­è¨€ï¼š",
  "ä¸­æ–‡",
  "Droit PÃ©nal",
  "RÃ©visÃ©",
  "GÃ©nÃ©tique MolÃ©culaire"
];

for (const t of tests) {
  console.log(t, "->", decodeString(t));
}
