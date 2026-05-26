# OpenPrimer: Research & Strategy Notes

## Project Vision
To create an "Age of Diamond" style Universal Primer—an open-source, AI-generated repository of structured knowledge from Primary to Bachelor's (L3) level.

## Technical Stack (The "Nexus" Architecture)

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Brain** | Gemini 1.5 Flash (Vertex AI) | Best price/performance ratio for high-volume synthesis. |
| **Orchestrator** | Python (asyncio) on AWS EC2 | Low latency, high reliability for API ping-pong. |
| **State DB** | Supabase (PostgreSQL) | Free tier handles 500k rows easily; simplifies tracking. |
| **Storage** | GitHub (MDX files) | Git-based versioning for community corrections. |
| **Frontend** | Next.js (Static) | Free hosting on Vercel; SEO-friendly; fast. |

## The "Blast" Strategy (Leveraging Credits)
- **Goal**: Generate 100,000+ pages of core subjects (L1 Biology, CS, Physics, Math) in < 72 hours.
- **Budget**: Using $200 of GCP credits on Vertex AI.
- **Estimated Yield**: 
    - Gemini 1.5 Flash cost: ~$0.075 / 1M tokens in, ~$0.30 / 1M tokens out.
    - Avg. page: 1k tokens in (context), 1.5k tokens out (content).
    - Cost per page: ~$0.0005.
    - Total pages for $200: **~400,000 pages**.

## Content Structure (MDX)
Each page will follow a strict template to ensure interoperability:
```mdx
---
title: "Introduction to Mitosis"
level: "L1"
subject: "Biology"
module: "Cell Biology"
tags: ["cell cycle", "division"]
---

# Introduction to Mitosis
... (Generated Content) ...

<InteractiveQuiz>
  <Question q="What is the phase where chromosomes align?">
    <Option text="Prophase" />
    <Option text="Metaphase" correct />
  </Question>
</InteractiveQuiz>
```

## Next Steps
1. **Syllabus Mapping**: Create a master list of subjects and chapters (The "A_FAIRE" list).
2. **The Factory Script**: Write the Python orchestrator that consumes the list.
3. **The Web Shell**: A basic Next.js site that renders MDX from the local `content/` folder.
