function preprocessMdx(content) {
  let processed = content;
  
  // 1. Process DiagnosticQuiz options
  processed = processed.replace(/<DiagnosticQuiz([\s\S]*?)options=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    try {
      const arrStr = `[${p2}]`;
      const parsedArray = JSON.parse(arrStr);
      const joined = parsedArray.join('|||');
      return `<DiagnosticQuiz${p1}options="${joined}"${p3}/>`;
    } catch (e) {
      console.warn("options fallback parsing:", e.message);
      // Fallback: split by comma and clean quotes
      const items = p2.split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
      const joined = items.join('|||');
      return `<DiagnosticQuiz${p1}options="${joined}"${p3}/>`;
    }
  });

  // 2. Process DiagnosticQuiz correctIndex
  processed = processed.replace(/<DiagnosticQuiz([\s\S]*?)correctIndex=\{\s*(\d+)\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    return `<DiagnosticQuiz${p1}correctIndex="${p2}"${p3}/>`;
  });

  // 3. Process Prerequisites items
  processed = processed.replace(/<Prerequisites([\s\S]*?)items=\{\s*\[([\s\S]*?)\]\s*\}([\s\S]*?)\/>/gi, (match, p1, p2, p3) => {
    try {
      const arrStr = `[${p2}]`;
      const jsonValid = arrStr
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Quote keys
        .replace(/'/g, '"'); // Replace single quotes with double quotes
      
      const parsed = JSON.parse(jsonValid);
      const base64 = Buffer.from(JSON.stringify(parsed)).toString('base64');
      return `<Prerequisites${p1}itemsBase64="${base64}"${p3}/>`;
    } catch (e) {
      console.error("Failed to parse Prerequisites items in preprocessor:", e);
      return match;
    }
  });

  return processed;
}

const inputMdx = `
<Prerequisites items={[{ title: "Introduction to Social Sciences", slug: "intro-social-sciences", level: "L0", subject: "Social Sciences" }, { title: "Basic Algebra and Graphing", slug: "basic-algebra-graphing", level: "L0", subject: "Mathematics" }]} />

<DiagnosticQuiz question="Which of the following best describes the fundamental economic problem?" options={["How to maximize profit for businesses.", "How to allocate scarce resources to satisfy unlimited wants.", "How to ensure everyone has equal income.", "How to eliminate all poverty globally."]} correctIndex={1} targetSectionId="section-scarcity-foundation" sectionTitle="The Economic Problem: Scarcity" />
`;

const result = preprocessMdx(inputMdx);
console.log("=== Input ===");
console.log(inputMdx);
console.log("=== Result ===");
console.log(result);
