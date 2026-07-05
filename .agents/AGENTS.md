# OpenPrimer Workspace Guidelines & Rules

## 1. Absolute Factual & Scientific No-Fallback-to-AI Policy
- **Universal Ban on AI-Image Generation for Real/Factual Visual Assets**:
  - The prohibition on using AI image generation (`generate_image`) is extended from fine art and historical documents to **ALL factual and scientific visual assets**.
  - This includes, but is not limited to:
    - **Scientific and technical diagrams** (e.g., molecular representations like methane, chemical reactions, physical models).
    - **Data visualizations** (e.g., graphs, curves, plots, coordinate charts).
    - **Geographic and architectural visual assets** (e.g., authentic photos of monuments, archaeological sites, maps, country flags).
    - **Historical documents and physical artworks** (e.g., paintings, sculptures, tapestries, coins, ancient manuscripts, real historical photographs).
  - Using AI to simulate factual diagrams, scientific structures, or historical locations is strictly forbidden. Factual and visual integrity is paramount in educational material.

- **Strict "No Fallback to AI" Policy**:
  - If a genuine, legal, copyright-free, or public-domain image or diagram is not available for a specific topic, **do not display any image** and **do not attempt to generate an AI fallback**. Simply omit the image or figure entirely.

---

## 2. Image Discovery and Sequential Search Strategy (Max 3 Retries)
When inserting or recommending an image, figure, or illustration, you must search for existing, genuine, highly informative public-domain/open-source assets. You must employ a sequential search strategy across a minimum of **three sources** in order of probability of success (highest hope to lowest hope):

### Discovery Workflow
1. **Define the Target**: Determine the exact nature of the required image (e.g., a 2D line graph of a function, a 3D molecular render of methane, an authentic photograph of the Scrovegni Chapel).
2. **Order of Hope (Espérance de trouver)**: Select the 3 most promising databases from the list below based on the asset category.
3. **Sequential Attempts (Max 3)**:
   - **Attempt 1**: Query the first database (most likely to contain the image, such as Wikipedia/Wikimedia Commons for scientific concepts). If found and suitable, use it.
   - **Attempt 2**: If the first query fails or has licensing restrictions, query the second most likely database.
   - **Attempt 3**: If the second query also fails, query the third database.
4. **Failure Condition**: If all three attempts fail to yield an authentic, copyright-free, and educational-grade image, **do not render any image or figure**.

---

## 3. Approved Open-Access & Public-Domain Databases by Category

### A. General & Scientific Illustrative Assets (Math, Science, Geography, History, Diagrams)
- **Wikimedia Commons / Wikipedia**: The primary, most comprehensive repository for general educational media, including excellent scientific diagrams, molecular renders, geographic pictures, curves, and mathematical diagrams.
- **Sciencemedia & open-access scientific repositories**: Excellent for molecular files, specific lab setups, and math plots.

### B. Fine Arts, Manuscripts & Historical Documents
- **Metropolitan Museum of Art Open Access (The Met)**: Over 492,000 public-domain masterpiece images.
- **Rijksmuseum Rijksstudio**: Hundreds of thousands of high-definition works free of copyright (ideal for European art).
- **National Gallery of Art Open Access (NGA)**: Offers more than 50,000 public-domain images.
- **Paris Musées**: Over 150,000 digital reproductions from municipal museums under CC0 (Public Domain).
- **Smithsonian Open Access**: Millions of assets across art, history, and science under CC0.
- **Getty Open Content Program**: Digitized assets of manuscripts, photography, and paintings.
- **The Art Institute of Chicago**: Extensive open-access collections under CC0.
- **Europeana**: Multi-institutional aggregator of European digital cultural heritage.
- **Library of Congress / British Museum**: For historical documents, photographs, and global heritage.

---

## 4. Restraints on AI-Image Generation
- **Restricted Usage**:
  - AI image generation (`generate_image`) must be strictly reserved for general contextual, abstract, or highly conceptual illustrations (e.g. general educational visual metaphors, standard stylized scientific backgrounds, or non-specific textures).
- **Impeccable Quality & Consistency**:
  - Any AI-generated illustration must be of professional graphic design quality. If quality or accurate details cannot be guaranteed, **avoid generating or showing the illustration**.

---

## 5. Optimized AI Generation Parameters (Gemini 2.5 Flash Booster Guidelines)

To maximize generation performance, conceptual richness, and structural integrity across the generation pipelines (Scribe, Architects, Revision, and Translator), the following parameter mappings must be systematically configured and maintained:

### A. Academic & Narrative Content Generation (Scribe / Revision Narrator)
For open-ended academic prose, detailed context-building, or global revisions, a moderately exploratory configuration is calibrated to prevent lexical stagnation (avoiding overused transitional terms like *"En effet"*, *"Ainsi"*, *"Par conséquent"*) and encourage diverse, highly engaging narrative paths.
- **Temperature**: `0.35`
- **Frequency Penalty**: `0.25`
- **Top-P**: `0.85`
- **Max Output Tokens**: `8192`

### B. Structural & Schema-Bound Tasks (Syllabus, Widgets, Audits, JSON Outputs)
For tasks outputting strict schemas, JSON arrays, key-value mappings, and programmatic components, zero-error execution is paramount. The generation parameters must guarantee maximum determinism to prevent unclosed boundaries or corrupted attributes.
- **Temperature**: `0.1` (or `0.0` where strict schema compliance is required)
- **Response MIME Type**: `application/json`
- **Frequency Penalty / Top-P**: Not set (disabled to enforce deterministic paths)

### C. Language-Specific and Regional Alignment (Translation & Localization)
Translation and localization tasks must maintain absolute structure, mapping exact MDX components and attributes, while translating only the natural text.
- **Temperature**: `0.1`


