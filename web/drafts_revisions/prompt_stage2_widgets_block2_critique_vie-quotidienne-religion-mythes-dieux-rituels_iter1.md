You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "cite_etat",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Cités-États",
        "source": "Wikipedia",
        "text": "A city-state is an independent sovereign city which serves as the center of political, economic, and cultural life over its contiguous territory. Historically, many ancient civilizations were organized into city-states, such as those in ancient Greece and Mesopotamia. They often featured a distinct form of governance and a strong sense of civic identity among their inhabitants."
      }
    },
    {
      "id": "homere",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Homère",
        "source": "Wikipedia",
        "text": "Homère (Homer in English) is the legendary author of the Iliad and the Odyssey, two epic poems that are central works of ancient Greek literature. He is considered one of the most influential authors in Western culture. His works profoundly shaped ancient Greek culture and education, influencing philosophy, art, and rhetoric."
      }
    },
    {
      "id": "mythologie",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Mythologie",
        "source": "Wikipedia",
        "text": "Mythologie refers to a collection of myths, especially those belonging to a particular sacred tradition. These stories often explain natural phenomena, cultural practices, or the origins of a people. Greek mythology, for example, is a body of myths and teachings that belong to the ancient Greeks, concerning their gods and heroes, the nature of the world, and the origins and significance of their own cult and ritual practices."
      }
    },
    {
      "id": "pantheon_grec",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "source": "Wikipedia",
        "text": "The Panthéon grec (Greek Pantheon) refers to the collective body of gods and goddesses in ancient Greek mythology. These deities were believed to reside on Mount Olympus and governed various aspects of the natural world and human life. Major figures include Zeus, Hera, Poseidon, Demeter, Athena, Apollo, Artemis, Ares, Aphrodite, Hephaestus, Hermes, and Hestia."
      }
    },
    {
      "id": "olympe",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "source": "Wikipedia",
        "text": "Olympe (Mount Olympus) is the highest mountain in Greece and was considered the home of the twelve Olympian gods in Greek mythology. It was believed to be a majestic and sacred place, often shrouded in clouds, where the gods held their councils and feasted. The term 'Olympus' is often used metaphorically to refer to the abode of the gods."
      }
    },
    {
      "id": "do_ut_des",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "source": "Wikipedia",
        "text": "Do ut des is a Latin phrase meaning 'I give, so that you may give.' It describes a reciprocal relationship, particularly in ancient religious practices where offerings were made to deities with the expectation of receiving divine favor in return. This concept highlights the contractual nature of many ancient religious rituals and the belief in a balanced exchange between humans and the divine."
      }
    },
    {
      "id": "pythie",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Pythie",
        "source": "Wikipedia",
        "text": "The Pythie (Pythia) was the High Priestess of the Temple of Apollo at Delphi, who served as the oracle. She was renowned for delivering prophecies and advice, often in an ecstatic trance, which were then interpreted by priests. Her pronouncements were highly influential throughout the ancient Greek world, guiding political decisions and personal fates."
      }
    },
    {
      "id": "paideia",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Paideia",
        "source": "Wikipedia",
        "text": "Paideia is a Greek term referring to the system of education and training in ancient Greece, encompassing both physical and mental development. It aimed at cultivating ideal citizens, emphasizing rhetoric, grammar, music, mathematics, philosophy, and gymnastics. The concept represented the upbringing of the ideal member of the polis, reflecting the holistic approach to human flourishing."
      }
    },
    {
      "id": "symposium",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "source": "Wikipedia",
        "text": "A symposium (plural: symposia) in ancient Greece was a drinking party held after a banquet, primarily for men, where they would engage in philosophical discussions, poetry recitations, and entertainment. It was a crucial social institution where elite men could gather to debate, socialize, and reinforce their cultural bonds. The term has evolved to mean a conference or meeting for discussion of a particular subject."
      }
    },
    {
      "id": "polytheisme",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "source": "Wikipedia",
        "text": "Polythéisme (Polytheism) is the belief in or worship of multiple gods. These gods and goddesses often form a pantheon of deities, each with their own myths, rituals, and areas of influence. Ancient Greek religion is a prominent example of a polytheistic system, where various gods like Zeus, Hera, and Apollo were worshipped."
      }
    },
    {
      "id": "homer",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Homère",
        "source": "Wikipedia",
        "text": "Homère (Homer in English) is the legendary author of the Iliad and the Odyssey, two epic poems that are central works of ancient Greek literature. He is considered one of the most influential authors in Western culture. His works profoundly shaped ancient Greek culture and education, influencing philosophy, art, and rhetoric."
      }
    },
    {
      "id": "hellenisme",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "hellénisme",
        "source": "Wikipedia",
        "text": "L'hellénisme (Hellenism) refers to the study or imitation of ancient Greek culture, especially in its classical period. More broadly, it denotes the spread of Greek culture, language, and ideas throughout the ancient world after the conquests of Alexander the Great. This era, known as the Hellenistic period, saw a fusion of Greek and local cultures across a vast empire."
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, "N/A", "## Section Name", or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, Image, Audio, Video, EventLink, HistoricalEventLink, EvenementHistorique, and ÉvénementHistorique). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.
6. CRITICAL WIDGET CONNECTION: Every interactive component or hover card (Biography, RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, EventLink) must be strongly connected to the lesson's topics, informative, and detailed.

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