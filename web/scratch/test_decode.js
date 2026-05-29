const str1 = "å¤§ä¸€";
const str2 = "FranÃ§ais";
const str3 = "MÃ©canique Classique";
const str4 = "å½“å‰ è¯­è¨€ï¼š";
const str5 = "ä¸­æ–‡";

console.log("str1:", Buffer.from(str1, 'latin1').toString('utf8'));
console.log("str2:", Buffer.from(str2, 'latin1').toString('utf8'));
console.log("str3:", Buffer.from(str3, 'latin1').toString('utf8'));
console.log("str4:", Buffer.from(str4, 'latin1').toString('utf8'));
console.log("str5:", Buffer.from(str5, 'latin1').toString('utf8'));
