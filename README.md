# OpenPrimer

OpenPrimer est une plateforme éducative open-source dont le contenu est généré par IA pour offrir un standard de référence du savoir, du CP à la Licence.

## 🏗️ Structure du Projet

- `content/` : Base de données de cours au format MDX (générée par l'IA).
- `generator/` : Usine de génération de contenu (Python + Vertex AI).
- `web/` : Interface utilisateur (Next.js + Tailwind CSS).

## 🚀 Démarrage Rapide

### 1. Génération du Contenu
Allez dans le dossier `generator`, installez les dépendances et configurez votre projet GCP.

```bash
cd generator
pip install -r requirements.txt
python syllabus_mapper.py  # Crée la structure des cours
python orchestrator.py     # Lance la génération (Mock par défaut sans .env)
```

### 2. Interface Web
Allez dans le dossier `web` et lancez le serveur de développement.

```bash
cd web
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## 🎨 Fonctionnalités
- **Mode Sombre Premium** : Design moderne avec glassmorphisme.
- **MDX Interactif** : Support des Quiz et simulations directement dans les cours.
- **Arborescence Dynamique** : Navigation fluide à travers les niveaux et matières.

## 📝 Licence
Ce projet est sous licence MIT. Les contenus générés sont destinés à rester libres et gratuits.
