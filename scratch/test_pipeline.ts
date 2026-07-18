import { stitchLessonContent, healNarrativeCitations, deduplicateLessonWidgetsAndReferences } from '../web/src/lib/ai';
import { preprocessMdx } from '../web/src/lib/content';

async function runTest() {
  console.log("=== Running Pipeline Integrity Unit Test ===");

  const mockNarrative = `
# Leçon sur l'IA

L'intelligence artificielle est un domaine en pleine expansion [1]. 
Certains chercheurs comme Alan Turing ont posé les bases théoriques de l'informatique [16].
Nous pouvons également nous référer à d'autres travaux [4].
D'ailleurs, voici une citation supplémentaire [10].
  `.trim();

  const mockWidgets = {
    glossary: [
      { term: "IA", definition: "Intelligence Artificielle" },
      { term: "Machine Learning", definition: "Apprentissage automatique" }
    ],
    references: [
      "[1] Alan Turing, Computing Machinery and Intelligence, 1950.",
      "[4] McCarthy John, LISP, 1960.",
      "[10] Russell & Norvig, Artificial Intelligence: A Modern Approach.",
      "[16] DeepMind, AlphaGo paper, Nature 2016."
    ]
  };

  const healedNarrative = healNarrativeCitations(mockNarrative);
  console.log("\n--- HEALED NARRATIVE ---");
  console.log(healedNarrative);

  console.log("\n--- DEDUPLICATING WIDGETS AND REFERENCES ---");
  const { widgets: dedupedWidgets, narrativeMdx: dedupedMdx } = await deduplicateLessonWidgetsAndReferences(
    "IA",
    "emergence-ia",
    mockWidgets as any,
    healedNarrative,
    "fr",
    []
  );
  console.log("Deduped narrative:");
  console.log(dedupedMdx);
  console.log("Deduped widgets references:");
  console.log(dedupedWidgets.references);

  console.log("\n--- STITCHING CONTENT ---");
  const stitched = stitchLessonContent(dedupedMdx, dedupedWidgets, false);
  console.log(stitched);

  console.log("\n--- PREPROCESSING MDX ---");
  const preprocessed = preprocessMdx(stitched, 'fr');
  console.log(preprocessed);

  // Check if there are any unresolved widgets or brackets
  const hasUnresolvedWidget = preprocessed.includes("WIDGET:Reference");
  console.log("\n--- VERIFICATION ---");
  console.log("Has unresolved Reference widgets:", hasUnresolvedWidget);
  
  // Extract and decode references base64 payload
  const refMatch = preprocessed.match(/<References\s+itemsBase64="([^"]*?)"\s*\/?>/i);
  if (refMatch) {
    const base64 = refMatch[1];
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    console.log("Decoded references list payload:");
    console.log(JSON.parse(decoded));
  } else {
    console.log("[ERROR] References tag not found!");
  }
}

runTest().catch(console.error);
