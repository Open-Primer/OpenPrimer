You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "flux_valorisation_derive",
      "componentType": "Mermaid",
      "sectionAnchor": "## Diagramme illustrant le flux de valorisation des dérivés via la mesure neutre au risque",
      "props": {
        "code": "graph TD\n    A[Début: Contrat de Dérivé] --> B{Identifier le sous-jacent et les flux futurs}\n    B --> C[Définir la mesure neutre au risque (Q)]\n    C --> D{Modéliser le prix du sous-jacent sous Q}\n    D --> E[Calculer l'espérance des flux futurs actualisés sous Q]\n    E --> F[Appliquer le taux sans risque pour l'actualisation]\n    F --> G[Obtenir la valeur actuelle du dérivé]\n    G --> H[Fin: Valorisation du Dérivé]"
      }
    },
    {
      "id": "radon_nikodym_formula",
      "componentType": "Image",
      "sectionAnchor": "## Formule de la densité de Radon-Nikodym pour le changement de mesure",
      "props": {
        "description": "Cette figure présente la formule mathématique de la densité de Radon-Nikodym, un concept fondamental en théorie des probabilités et en finance quantitative. Elle est utilisée pour exprimer la relation entre deux mesures de probabilité équivalentes, P et Q, sur un même espace mesurable. La densité, souvent notée dQ/dP, permet de transformer les espérances d'une mesure à l'autre, ce qui est crucial pour le changement de mesure de probabilité dans le cadre de la valorisation neutre au risque.",
        "title": "Densité de Radon-Nikodym",
        "year": "2023"
      }
    },
    {
      "id": "girsanov_drift_change",
      "componentType": "Mermaid",
      "sectionAnchor": "## Illustration schématique du changement de drift d'un processus stochastique via le théorème de Girsanov",
      "props": {
        "code": "graph TD\n    A[Processus Stochastique sous Mesure P] --> B{Théorème de Girsanov}\n    B --> C[Changement de Mesure de P à Q]\n    C --> D[Modification du Drift (Tendance) du Processus]\n    D --> E[La Volatilité (Diffusion) Reste Inchangée]\n    E --> F[Nouveau Processus Stochastique sous Mesure Q]\n    F --> G[Application: Valorisation Neutre au Risque]"
      }
    },
    {
      "id": "valuation_process_diagram",
      "componentType": "Image",
      "sectionAnchor": "## Diagramme du processus de valorisation d'un dérivé sous mesure neutre au risque",
      "props": {
        "description": "Ce diagramme illustre les étapes clés du processus de valorisation d'un instrument dérivé en utilisant l'approche de la mesure neutre au risque. Il commence par l'identification des flux de trésorerie futurs du dérivé, puis passe par la modélisation du sous-jacent sous la mesure neutre au risque, le calcul de l'espérance de ces flux actualisés, et enfin l'obtention de la valeur actuelle du dérivé. Ce processus est fondamental en finance quantitative pour évaluer équitablement les produits dérivés.",
        "title": "Processus de Valorisation Neutre au Risque",
        "year": "2023"
      }
    },
    {
      "id": "risk_neutral_framework_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Schéma conceptuel du cadre de valorisation neutre au risque",
      "props": {
        "code": "graph TD\n    A[Marché Financier Incomplet] --> B{Absence d'opportunités d'arbitrage}\n    B --> C[Existence d'une mesure neutre au risque (Q)]\n    C --> D[Théorème Fondamental de la Finance]\n    D --> E[Prix d'un actif = Espérance actualisée sous Q]\n    E --> F[Application: Valorisation des Dérivés]\n    F --> G[Gestion des Risques]"
      }
    },
    {
      "id": "risk_neutral_steps",
      "componentType": "SolvedExercise",
      "sectionAnchor": "## Exercice résolu sur les étapes clés de la valorisation neutre au risque",
      "props": {
        "title": "Valorisation d'une option européenne sous mesure neutre au risque",
        "year": "2023"
      }
    },
    {
      "id": "shreve_risk_neutral",
      "componentType": "Quote",
      "sectionAnchor": "## Citation de Steven Shreve sur l'importance de la mesure neutre au risque",
      "props": {
        "quote": "The risk-neutral measure is not just a mathematical trick; it is the fundamental tool that allows us to price derivatives consistently with the market, by removing the investor's risk aversion from the pricing equation.",
        "source": "Stochastic Calculus for Finance II: Continuous-Time Models",
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