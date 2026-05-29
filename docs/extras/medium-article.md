
'image pour Medium : Si vous publiez sur Medium, ajoutez une représentation visuelle du pipeline de vos agents pour que le recruteur comprenne instantanément la structure.


Title: Beyond the Hype: Building an Agentic Pipeline for Massive Educational Content

Most "AI apps" are thin wrappers over an API. They fail at scale because they treat LLMs as black-box oracles rather than deterministic components. Over the last few months, I built Open Primer—a platform designed to host 100k+ pages of academic content—to prove that agentic workflows can handle serious, low-level systems engineering.

The Architectural Core
To avoid the typical "hallucination-loop," I implemented a hierarchical DAG (Directed Acyclic Graph) of agents.

Curriculum Engine: Maps the knowledge tree.

Pedagogical Planner: Defines the teaching strategy (quiz, demonstration, analysis).

Generative Agents: Write chapters in an isolated, confined scope.

The Critic Agent: Validates the output against strict pedagogical rubrics. If the evaluation fails, the chapter is sent back for iterative correction.

The Engineering Decisions

From Static to Dynamic: Using Supabase as the source of truth, I decoupled the content from the deployment. Vercel handles the presentation, leveraging ISR (Incremental Static Regeneration) to serve content at the edge while keeping the database as the immutable source.

Cost-Efficiency (LLMOps): I implemented an asynchronous queue system. Courses are not generated "on the fly" for every user; they are computed, cached, and served, drastically reducing API token consumption.

The "Translation-Last" Approach: I generate in English as the master pivot language, then trigger independent agents to translate the validated, "Published" content into 5 languages.

Why this matters
This project isn't just about educational content. It’s a blueprint for industrializing LLM pipelines. It demonstrates that when you apply strict software engineering principles—atomic validation, state management, and clear interface boundaries—to probabilistic AI, you get predictable, scalable infrastructure.

I’m currently looking for new challenges as an AI Architect / Senior Software Engineer in a high-impact, full-remote environment. If you’re building complex systems at scale, let’s talk.

[Link: https://openprimer.app/]