This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🚀 Hybrid Content Authoring & Synchronization

OpenPrimer uses a **Hybrid content pipeline** that bridges local, version-controlled MDX authoring with a live PostgreSQL database (`lessons` table in Supabase) for fast rendering in production.

### Content Synchronization Commands

Inside the `web/` directory, you can run the following utilities to keep your local workspace and live database in sync:

1. **Import local MDX files to Supabase**:
   ```bash
   npm run db:import-mdx
   ```
   Parses all local `.mdx` files inside `content/` and performs an `UPSERT` into the PostgreSQL `lessons` table on Supabase. Great for publishing your git-tracked markdown updates to production instantly.

2. **Export Supabase database lessons to local MDX**:
   ```bash
   npm run db:export-mdx
   ```
   Downloads all active lessons from the `lessons` table and writes them back into local `content/` filesystem structures matching the course taxonomy (`[level]/[subject]/[course]/[lesson].[lang].mdx`). Perfect for backing up dynamic AI-generated lessons to Git.

3. **Export static SQL seed data**:
   ```bash
   npm run db:export
   ```
   Exports a clean SQL insert seed (`supabase_seed.sql`) containing only core catalog and course content while strictly scrubbing out sensitive user profile, feedback, and tracking data.

For complete documentation on switching over and architectural details, see the [Pedagogical Synchronization Guide](../docs/PEDAGOGICAL_SYNC.md).

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
