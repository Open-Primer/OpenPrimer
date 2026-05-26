import { NextResponse } from 'next/server';
import { dbService } from '../../../../lib/db';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const { data: logs } = await dbService.getSearchHistory();

    const formattedLogs = logs && logs.length > 0
      ? logs.map((l: any) => `- Query: "${l.query}" | Success: ${l.wasSuccessful} | Time: ${l.timestamp}`).join('\n')
      : "No student search queries recorded yet.";

    if (apiKey) {
      console.log(`[ANALYTICS AGENT] Dispatching logs analysis to Gemini...`);
      
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const systemInstruction = `You are an elite academic analytics agent for OpenPrimer. 
Analyze the provided student search logs to extract:
1. Search trends and high-interest topics.
2. Content Gaps: queries that returned 0 results or failed.
3. Specific curriculum modules and syllabus improvements the administrator should generate next.
Provide a highly professional markdown report. Write in French if the prompt/context suggests, otherwise default to English. Keep it concise, structural, and actionable.`;

      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Here are the search logs to analyze:\n\n${formattedLogs}` }]
          }],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            temperature: 0.2
          }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini Analytics Error: ${errorText}`);
      }

      const responseJson = await res.json();
      const reportMarkdown = responseJson.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate report.";

      return NextResponse.json({ success: true, report: reportMarkdown });
    } else {
      console.warn('[ANALYTICS AGENT WARNING] GEMINI_API_KEY is not configured. Returning simulated mock report...');
      
      const mockReport = `### 📊 Rapport d'Analyse des Écarts de Contenu (Content Gap)

**Période : Analyse en Temps Réel**
*Mécanisme : Agent IA OpenPrimer (Gemini 1.5 Flash - Simulation Hors-Ligne)*

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
Pour maximiser l'engagement des étudiants, il est fortement recommandé de générer les modules suivants :
* **Physique Quantique L2** : Module de 4 ECTS couvrant l'équation de Schrödinger, les puits de potentiel et l'intrication.
* **Topologie Mathématique L3** : Module rigoureux sur les espaces topologiques et métriques.
* **Microéconomie Théorique L1** : Cursus axé sur le consommateur et la théorie des jeux élémentaire.

*Rapport généré automatiquement par l'Agent d'Analyse Intelligente OpenPrimer.*`;

      return NextResponse.json({ success: true, report: mockReport });
    }
  } catch (err: any) {
    console.error(`[ANALYTICS AGENT ERROR]`, err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
