# Technical Architecture of OpenPrimer

This document details the software infrastructure enabling the massive generation and distribution of knowledge.

## 1. Content Factory (Python / Vertex AI)
The generation pipeline follows an agentic flow powered by **LangChain**:
1.  **Ingestion Agent**: Researches official syllabi and open-courseware resources.
2.  **Synthesis Agent**: Drafts structured `.mdx` files by chapters.
3.  **Quiz Agent**: Creates mini-quizzes and global tests based on content.
4.  **Translation Agent**: Localizes the corpus into multiple languages.

## 2. Front-end (Next.js / Tailwind CSS)
The user interface is optimized for reading and interaction:
- **Dynamic Rendering**: `next-mdx-remote` to inject interactive React components into markdown.
- **Context Engine**: Asynchronous delivery of active page content to the AI Tutor (Side Pane).
- **Gamification**: Management of user state (KP, Levels, UVs) via LocalStorage or Supabase.

## 3. Vector Intelligence
- **Embeddings**: Each module is transformed into vectors via Vertex AI Embeddings.
- **Vector Search**: Semantic search and interactive "Knowledge Map" to link concepts across disciplines.

## 4. Revision Loop (Auto-Wiki)
- **Feedback API**: Collection of user reports.
- **Correction Agent**: Analyzes reports on the GCP VM and automatically updates MDX files on GitHub.

## 🧱 Folder Structure
```
OpenPrimer/
├── content/          # MDX Knowledge Database
├── generator/        # Generation Factory (Python)
├── web/              # User Interface (Next.js)
├── docs/             # Project Documentation
├── scripts/          # Public Automation Scripts
└── private_scripts/  # Specific Configurations (GCP, etc.)
```
