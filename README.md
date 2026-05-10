# OpenPrimer

> **Universal knowledge, finally free and tutored by artificial intelligence.**

OpenPrimer is an open-source project aiming to synthesize the entirety of academic knowledge, from primary school to Bachelor's degree, in the form of an interactive manual and personalized AI tutor.

## 🌟 Vision
OpenPrimer is not just a course website. It is a **transition tool** designed to offer a "Dual-Pane" learning experience: academic reference knowledge on the left, and intelligent conversational support on the right.

## 🏗️ Architecture & Philosophy
The project rests on three technological pillars:
1.  **Content Factory**: An asynchronous factory (Python + Vertex AI) that scrapes, synthesizes, and translates global academic knowledge.
2.  **Explorer**: An ultra-clean Next.js interface focused on interaction and academic gamification (Knowledge Points, UVs).
3.  **Auto-Wiki**: A feedback loop where user reports feed a correction AI to maintain the quality of the corpus.

[Read more on Project Guidelines](PROJECT_GUIDELINES.md) | [Check the Technical Architecture](docs/ARCHITECTURE.md)

## 🚀 Quick Start (POC)

### 1. Generation (Google Cloud VM)
The generation engine runs on a GCP VM to "blast" content.
```bash
gcloud compute ssh openprimer-factory
cd /opt/openprimer/generator
python3 orchestrator.py
```

### 2. Web Interface (Local)
```bash
cd web
npm install
npm run dev
```

## 🤝 Contributing
We need you to validate content and suggest new curricula. Check our [Contribution Guide](docs/CONTRIBUTING.md).

## 📝 License
OpenPrimer is a common good under the MIT license. Generated content is intended to remain free, gratis, and accessible to all.
