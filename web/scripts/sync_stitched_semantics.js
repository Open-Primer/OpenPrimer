const fs = require('fs');
const path = require('path');

const cleanMdxPath = path.join(__dirname, '../drafts_revisions/extracted_cognitive_semantics.mdx');
const stitchedPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_racines-signification-formel-cognitif.mdx');

if (!fs.existsSync(cleanMdxPath)) {
  console.error("🚨 Clean MDX source file does not exist!");
  process.exit(1);
}

const cleanMdxContent = fs.readFileSync(cleanMdxPath, 'utf-8');

// Construct the JSON object
const jsonObj = {
  mdxContent: cleanMdxContent
};

// Convert to formatted JSON string
const jsonStr = JSON.stringify(jsonObj, null, 2);

// Construct the full stitched file content
const fullStitchedContent = `---\n\`\`\`json\n${jsonStr}\n\`\`\`\n`;

// Write to the stitched file
fs.writeFileSync(stitchedPath, fullStitchedContent, 'utf-8');
console.log("✅ Successfully synchronized and serialized the entire cognitive semantics MDX into the stitched file!");
