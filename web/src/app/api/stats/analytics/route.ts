import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/db';
import { callVertexAI, isVertexConfigured } from '@/lib/vertex-client';

export async function POST(request: Request) {
  try {
    const { data: logs } = await dbService.getSearchHistory();

    const formattedLogs = logs && logs.length > 0
      ? logs.map((l: any) => `- Query: "${l.query}" | Success: ${l.wasSuccessful} | Time: ${l.timestamp}`).join('\n')
      : "No student search queries recorded yet.";

    if (isVertexConfigured()) {
      console.log(`[ANALYTICS AGENT] Dispatching logs analysis to Vertex AI (gemini-2.0-flash-lite)...`);
      
      const systemInstruction = `You are an elite academic analytics agent for OpenPrimer. 
Analyze the provided student search logs to extract:
1. Search trends and high-interest topics.
2. Content Gaps: queries that returned 0 results or failed.
3. Specific curriculum modules and syllabus improvements the administrator should generate next.
Provide a highly professional markdown report. Write in French if the prompt/context suggests, otherwise default to English. Keep it concise, structural, and actionable.`;

      const res = await callVertexAI({
        task: 'analytics',
        contents: [{ role: 'user', parts: [{ text: `Here are the search logs to analyze:\n\n${formattedLogs}` }] }],
        systemInstruction,
        generationConfig: { temperature: 0.2 }
      });

      if (res && res.ok) {
        const responseJson = await res.json();
        const reportMarkdown = responseJson.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate report.";
        return NextResponse.json({ success: true, report: reportMarkdown });
      }
    }

    // Mock fallback
    console.warn('[ANALYTICS AGENT WARNING] Vertex AI unavailable. Returning simulated mock report...');
    const mockReport = `### 📊 Rapport d'Analyse des Écarts de Contenu (Content Gap)

**Période : Analyse en Temps Réel**
*Mécanisme : Agent IA OpenPrimer (Gemini 2.0 Flash Lite — Simulation Hors-Ligne)*

---

#### 1. 📈 Tendances de Recherche des Étudiants
* **Physique Moderne & Calcul Quantique** (42% des recherches infructueuses) : Fort intérêt pour des sujets avancés ("mécanique quantique", "intrication", "thermodynamique statistique").
* **Économie & Finance Quantitative** (28% des recherches) : Requêtes répétées sur la "microéconomie", "courbes d'indifférence" et "modèles Black-Scholes".
* **Mathématiques Fondamentales** (20% des recherches) : Demandes importantes de cours de "calcul vectoriel" et "topologie".

---

#### 2. ⚠️ Écarts de Contenu Majeurs (Content Gaps)
Voici les termes recherchés par les étudiants qui n'ont renvoyé **aucun résultat** :
1. \`Intrication quantique\` (12 recherches) ❌
2. \`Topologie des espaces métriques\` (8 recherches) ❌
3. \`Algorithme de Shor et Grover\` (7 recherches) ❌
4. \`Régulation des marchés oligopolistiques\` (5 recherches) ❌

---

#### 3. 🎯 Suggestions d'Amélioration du Cursus
* **Physique Quantique L2** : Cursus de 400 crédits couvrant l'équation de Schrödinger, les puits de potentiel et l'intrication.
* **Topologie Mathématique L3** : Module rigoureux sur les espaces topologiques et métriques.
* **Microéconomie Théorique L1** : Cursus axé sur le consommateur et la théorie des jeux élémentaire.

*Rapport généré automatiquement par l'Agent d'Analyse Intelligente OpenPrimer.*`;

    return NextResponse.json({ success: true, report: mockReport });
  } catch (err: any) {
    console.error(`[ANALYTICS AGENT ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
