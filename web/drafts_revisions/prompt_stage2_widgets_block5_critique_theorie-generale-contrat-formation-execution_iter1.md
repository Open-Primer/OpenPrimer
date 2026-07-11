You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "interactiveComponents": [
    {
      "id": "contract_lifecycle",
      "componentType": "Mermaid",
      "sectionAnchor": "Cycle de vie du contrat",
      "props": {
        "chart": "graph TD\n    A[Négociation Précontractuelle] --> B{Offre et Acceptation};\n    B --> C{Formation du Contrat};\n    C --> D[Exécution des Obligations];\n    D --> E{Incidents d'Exécution?};\n    E -- Oui --> F[Sanctions de l'Inexécution];\n    E -- Non --> G[Extinction du Contrat];\n    F --> G;\n    G --> H[Conséquences Post-Contractuelles];"
      }
    },
    {
      "id": "conditions_validite",
      "componentType": "Mermaid",
      "sectionAnchor": "Conditions de validité du contrat",
      "props": {
        "chart": "graph TD\n    A[Contrat Valide] --> B{Consentement};\n    B -- Oui --> C{Capacité des Parties};\n    C -- Oui --> D{Objet Licite et Certain};\n    D -- Oui --> E{Cause Licite};\n    E -- Oui --> F[Contrat Formé];\n    B -- Non --> G[Nullité Relative];\n    C -- Non --> G;\n    D -- Non --> H[Nullité Absolue];\n    E -- Non --> H;"
      }
    },
    {
      "id": "sanctions_inexecution",
      "componentType": "Mermaid",
      "sectionAnchor": "Sanctions de l'inexécution contractuelle",
      "props": {
        "chart": "graph TD\n    A[Inexécution Contractuelle] --> B{Mise en Demeure};\n    B --> C{Options du Créancier};\n    C --> D[Exécution Forcée en Nature];\n    C --> E[Réduction du Prix];\n    C --> F[Résolution du Contrat];\n    C --> G[Réparation du Préjudice (Dommages et Intérêts)];\n    D --> H[Contrat Exécuté];\n    E --> H;\n    F --> I[Contrat Anéanti];\n    G --> J[Compensation];"
      }
    },
    {
      "id": "synthese_contrat",
      "componentType": "Mermaid",
      "sectionAnchor": "Synthèse du cycle de vie du contrat",
      "props": {
        "chart": "graph TD\n    A[Phase Précontractuelle] --> B[Formation du Contrat];\n    B --> C[Exécution du Contrat];\n    C --> D[Inexécution?];\n    D -- Oui --> E[Sanctions];\n    D -- Non --> F[Extinction du Contrat];\n    E --> F;"
      }
    },
    {
      "id": "carbonnier_loi_parties",
      "componentType": "Citation",
      "sectionAnchor": "La force obligatoire du contrat",
      "props": {
        "quote": "Le contrat est la loi des parties.",
        "author": "Jean Carbonnier",
        "source": "Droit civil, Tome 4: Les Obligations",
        "year": "1955",
        "commentary": "Cette formule lapidaire de Jean Carbonnier, juriste français influent, encapsule le principe fondamental de la force obligatoire du contrat (pacta sunt servanda) en droit civil. Elle signifie que les engagements contractuels ont une valeur quasi-législative entre les parties qui les ont librement consentis, soulignant l'autonomie de la volonté comme pierre angulaire du droit des contrats. Le respect de cette 'loi des parties' est essentiel à la sécurité juridique et à la prévisibilité des relations économiques.",
        "original": ""
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.

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