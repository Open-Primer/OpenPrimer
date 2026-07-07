You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "image-noyau-structure",
      "componentType": "Image",
      "sectionAnchor": "## Cellular Organelles",
      "props": {
        "description": "A highly detailed, scientifically accurate illustration of a eukaryotic cell nucleus. The image should clearly show the nuclear envelope with nuclear pores, the nucleoplasm, chromatin (both euchromatin and heterochromatin), and a prominent nucleolus. The scale should be appropriate for visualizing these sub-structures. Use a clean, diagrammatic style with clear labeling potential.",
        "alt": "Diagram of a eukaryotic cell nucleus.",
        "caption": "*This diagram illustrates the intricate structure of the eukaryotic cell nucleus, highlighting its double-membraned nuclear envelope punctuated by nuclear pores, which regulate molecular transport. The internal organization reveals chromatin, composed of DNA and proteins, and the nucleolus, a site of ribosome biogenesis. Understanding these components is fundamental to comprehending gene expression and cellular control.*",
        "searchQuery": "eukaryotic cell nucleus structure",
        "title": "Structure of the Cell Nucleus"
      }
    },
    {
      "id": "image-golgi-structure",
      "componentType": "Image",
      "sectionAnchor": "## Cellular Organelles",
      "props": {
        "description": "A detailed, high-resolution diagram of the Golgi apparatus within a eukaryotic cell. The illustration should clearly depict the flattened membrane-bound sacs (cisternae) arranged in stacks, distinguishing between the cis-face (receiving side), medial cisternae, and trans-face (shipping side). Vesicles budding off and fusing with the cisternae should also be visible, illustrating its role in protein modification and transport. The style should be clear and educational.",
        "alt": "Diagram of the Golgi apparatus.",
        "caption": "*The Golgi apparatus, depicted here, is a central organelle in the endomembrane system, responsible for modifying, sorting, and packaging proteins and lipids synthesized in the endoplasmic reticulum. Its distinct cis, medial, and trans compartments facilitate sequential processing and targeted delivery of cellular products, underscoring its critical role in cellular secretion and membrane biogenesis.*",
        "searchQuery": "Golgi apparatus structure",
        "title": "Structure of the Golgi Apparatus"
      }
    },
    {
      "id": "image-mitochondria-structure",
      "componentType": "Image",
      "sectionAnchor": "## Cellular Organelles",
      "props": {
        "description": "A cross-sectional diagram of a mitochondrion, emphasizing its double-membrane structure. The outer mitochondrial membrane should be smooth, while the inner mitochondrial membrane should be highly folded into cristae. The intermembrane space and the mitochondrial matrix (containing ribosomes, mitochondrial DNA, and enzymes) should be clearly distinguishable. The illustration should convey its role as the powerhouse of the cell.",
        "alt": "Diagram of a mitochondrion.",
        "caption": "*This illustration details the mitochondrion, often referred to as the 'powerhouse' of the cell, due to its pivotal role in cellular respiration and ATP production. Its characteristic double membrane, with the inner membrane folded into cristae, significantly increases the surface area for enzymatic reactions, highlighting the structural adaptations that enable its metabolic efficiency.*",
        "searchQuery": "mitochondrion structure",
        "title": "Structure of the Mitochondrion"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.