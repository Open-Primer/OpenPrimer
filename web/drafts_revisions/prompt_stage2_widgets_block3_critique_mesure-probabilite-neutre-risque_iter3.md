You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "flux_valorisation_derive",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme illustrant le flux de valorisation des dérivés via la mesure neutre au risque",
      "props": {
        "code": "graph TD\nA[Dérivé Financier] --> B{Valorisation Neutre au Risque}\nB --> C[Mesure Neutre au Risque (Q)]\nC --> D[Espérance des Flux Futurs Actualisés]\nD --> E[Taux Sans Risque]\nE --> D\nD --> F[Prix du Dérivé]\nF --> G[Application Pratique]\nB --> H[Théorème Fondamental de l'Arbitrage]\nH --> C"
      }
    },
    {
      "id": "radon_nikodym_formula",
      "componentType": "Image",
      "sectionAnchor": "## Formule de la densité de Radon-Nikodym pour le changement de mesure",
      "props": {
        "description": "Représentation visuelle de la formule de la densité de Radon-Nikodym, qui est fondamentale pour le changement de mesure en probabilités, notamment pour passer d'une mesure physique à une mesure neutre au risque. La formule illustre comment la densité de probabilité d'une variable aléatoire change lorsque la mesure sous-jacente est modifiée, ce qui est crucial pour la valorisation des actifs financiers en l'absence d'opportunités d'arbitrage.",
        "title": "Formule de la densité de Radon-Nikodym",
        "year": "2023"
      }
    },
    {
      "id": "girsanov_drift_change",
      "componentType": "Mermaid",
      "sectionAnchor": "## Illustration schématique du changement de drift d'un processus stochastique via le théorème de Girsanov",
      "props": {
        "code": "graph TD\nA[Processus Stochastique Original (P)] --> B{Théorème de Girsanov}\nB --> C[Changement de Mesure]\nC --> D[Nouveau Processus Stochastique (Q)]\nD --> E[Changement de Drift]\nE --> F[Application en Finance]\nF --> G[Valorisation Neutre au Risque]\nB --> H[Densité de Radon-Nikodym]\nH --> C"
      }
    },
    {
      "id": "valuation_process_diagram",
      "componentType": "Image",
      "sectionAnchor": "## Diagramme du processus de valorisation d'un dérivé sous mesure neutre au risque",
      "props": {
        "description": "Un diagramme de flux illustrant les étapes clés du processus de valorisation d'un dérivé financier en utilisant l'approche de la mesure neutre au risque. Il commence par la définition du dérivé, passe par l'identification de la mesure neutre au risque appropriée, le calcul de l'espérance des flux futurs sous cette mesure, et se termine par l'actualisation de ces flux au taux sans risque pour obtenir le prix actuel du dérivé.",
        "title": "Processus de Valorisation Neutre au Risque",
        "year": "2023"
      }
    },
    {
      "id": "risk_neutral_framework_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Schéma conceptuel du cadre de valorisation neutre au risque",
      "props": {
        "code": "graph TD\nA[Absence d'Arbitrage] --> B{Existence de Mesure Neutre au Risque}\nB --> C[Valorisation par Espérance Actualisée]\nC --> D[Taux Sans Risque]\nD --> C\nC --> E[Prix Unique du Dérivé]\nB --> F[Théorème Fondamental de la Finance]\nF --> B"
      }
    },
    {
      "id": "risk_neutral_steps",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Exercice résolu sur les étapes clés de la valorisation neutre au risque",
      "props": {
        "title": "Valorisation d'une option européenne par mesure neutre au risque",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Option_europ%C3%A9enne",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_europ%C3%A9enne",
        "year": "2023"
      }
    },
    {
      "id": "shreve_risk_neutral",
      "componentType": "Quote",
      "sectionAnchor": "## Citation de Steven Shreve sur l'importance de la mesure neutre au risque",
      "props": {
        "quote": "The risk-neutral measure is the single most important concept in mathematical finance. It allows us to price derivatives by taking expectations under a fictitious probability measure, which simplifies calculations immensely.",
        "source": "Steven Shreve, Stochastic Calculus for Finance II: Continuous-Time Models",
        "url": "https://www.amazon.com/Stochastic-Calculus-Finance-II-Continuous-Time/dp/0387401016",
        "wikipediaLink": "https://en.wikipedia.org/wiki/Steven_Shreve",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Steven_Shreve",
        "year": "2004"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.