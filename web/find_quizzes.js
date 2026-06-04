const fs = require('fs');
const content = fs.readFileSync('intro_economic_thinking_full.mdx', 'utf8');

const regex = /<DiagnosticQuiz[\s\S]*?\/>/gi;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
  count++;
  console.log(`=== Match ${count} ===`);
  console.log(match[0]);
  console.log("=================\n");
}
