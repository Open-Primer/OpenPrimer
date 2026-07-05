const fs = require('fs');
const path = require('path');

const semPath = path.join(__dirname, '../drafts_revisions/final_stage3_stitched_racines-signification-formel-cognitif.mdx');
const rawContent = fs.readFileSync(semPath, 'utf-8').replace(/\r\n/g, '\n');

console.log("File length:", rawContent.length);

const jsonStartIndex = rawContent.indexOf('{');
const jsonEndIndex = rawContent.lastIndexOf('}');

if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
  const jsonStr = rawContent.substring(jsonStartIndex, jsonEndIndex + 1).trim();
  console.log("Found JSON block, length:", jsonStr.length);
  try {
    const parsed = JSON.parse(jsonStr);
    console.log("Successfully parsed JSON!");
    console.log("Keys:", Object.keys(parsed));
    console.log("mdxContent length:", parsed.mdxContent?.length);
    console.log("mdxContent first 300 chars:");
    console.log(parsed.mdxContent?.slice(0, 300));
    console.log("mdxContent last 300 chars:");
    console.log(parsed.mdxContent?.slice(-300));
    
    // Save extracted mdxContent
    fs.writeFileSync(path.join(__dirname, '../drafts_revisions/extracted_cognitive_semantics.mdx'), parsed.mdxContent, 'utf-8');
    console.log("Saved extracted MDX to drafts_revisions/extracted_cognitive_semantics.mdx");
  } catch (e) {
    console.error("Failed to parse JSON using lastIndexOf:", e.message);
  }
} else {
  console.log("Could not find json block indices.");
}
