const fs = require('fs');
const path = require('path');

const semPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_racines-signification-formel-cognitif.mdx');
const rawContent = fs.readFileSync(semPath, 'utf-8').replace(/\r\n/g, '\n');

console.log("Raw file length:", rawContent.length);

// Find the start of mdxContent value
const valStartStr = '"mdxContent": "';
const startIdx = rawContent.indexOf(valStartStr);

if (startIdx === -1) {
  console.error("Could not find start of mdxContent");
  process.exit(1);
}

const valStart = startIdx + valStartStr.length;

// Find the end of the JSON block.
// It is the newline followed by the closing brace of the JSON object.
const closingStr = '\n}';
const valEnd = rawContent.indexOf(closingStr, valStart);

if (valEnd === -1) {
  console.error("Could not find closing brace of the JSON object");
  process.exit(1);
}

console.log("valStart:", valStart, "valEnd:", valEnd);

// Extract the raw mdxContent string value
let mdxVal = rawContent.substring(valStart, valEnd);
console.log("Extracted mdxVal length:", mdxVal.length);

// Unescape the JSON string
function unescapeJsonString(str) {
  return str.replace(/\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, (match, p1) => {
    if (p1 === '"') return '"';
    if (p1 === '\\') return '\\';
    if (p1 === '/') return '/';
    if (p1 === 'b') return '\b';
    if (p1 === 'f') return '\f';
    if (p1 === 'n') return '\n';
    if (p1 === 'r') return '\r';
    if (p1 === 't') return '\t';
    if (p1.startsWith('u')) {
      return String.fromCharCode(parseInt(p1.substring(1), 16));
    }
    return match;
  });
}

let cleanMdxNarrative = unescapeJsonString(mdxVal).trim();
console.log("Initially cleaned MDX Narrative length:", cleanMdxNarrative.length);

// Remove the mistakenly swapped quote in the last tag if present
if (cleanMdxNarrative.endsWith('"</ConceptLink>')) {
  cleanMdxNarrative = cleanMdxNarrative.substring(0, cleanMdxNarrative.length - 15) + '</ConceptLink>';
  console.log("Fixed mistakenly swapped quote at the end of narrative!");
}

console.log("Cleaned MDX Narrative length:", cleanMdxNarrative.length);

// Now, extract the rest of the file after the closing brace of the JSON block
const restStart = valEnd + closingStr.length;
let restOfFile = rawContent.substring(restStart).trim();

// If it starts with a closing code fence, remove it
if (restOfFile.startsWith('```')) {
  restOfFile = restOfFile.substring(3).trim();
}

console.log("Rest of file length:", restOfFile.length);
console.log("Rest of file first 300 chars:\n", restOfFile.substring(0, 300));

// If restOfFile has a duplicate "## Conclusion" header, let's remove it.
if (restOfFile.startsWith('## Conclusion')) {
  restOfFile = restOfFile.substring('## Conclusion'.length).trim();
}

// Concatenate them together
const fullMdx = cleanMdxNarrative + "\n\n" + restOfFile;
console.log("Full MDX length:", fullMdx.length);

// Save the full cleaned MDX
const outputPath = path.join(__dirname, '../drafts_revisions/extracted_cognitive_semantics.mdx');
fs.writeFileSync(outputPath, fullMdx, 'utf-8');
console.log("Saved full cleaned MDX to drafts_revisions/extracted_cognitive_semantics.mdx");
