# ☁️ OpenPrimer Hybrid Storage & Environment Setup Guide
## Progressive Scaling (Supabase + Cloudflare R2)

This guide provides technical specifications for OpenPrimer's progressive hybrid storage model (`web/src/lib/r2.ts`) and presents the complete database/hosting environment variables setup required on **Vercel** and **Supabase** (excluding GitOps/GitHub variables).

---

## 1. 🏗️ The Progressive Hybrid Storage Model

As a non-profit academic repository, **OpenPrimer** is architected to minimize operational costs. We use a **Progressive Scaling** strategy that allows the platform to remain **100% Free** during its initial and growth phases, with a clear, seamless path to migrate to highly cost-effective object storage once the catalog expands.

### The Problem: PostgreSQL Database Limits
*   **Supabase Free Tier:** Includes a generous **500 MB** database limit.
*   **The Big Data Challenge:** Storing raw text/MDX files for *hundreds of thousands* of generated courses directly inside PostgreSQL table columns (such as the `lessons` table) will eventually exceed 500 MB, forcing a paid upgrade ($25/month).

### The Solution: Progressive Hybrid Storage (`web/src/lib/r2.ts`)
To solve this, we decoupled **metadata** from **heavy payload contents**:
1.  **PostgreSQL (Metadata):** Storing only lightweight relation details (user accounts, slug mappings, course structures, ects, and progress logs). Millions of metadata rows consume **under 150 MB**, keeping the Supabase database on the **Free Tier (0$) forever**.
2.  **Object Storage (Payloads):** Heavy Markdown/MDX lesson contents and student resources are stored as flat files in an external bucket.

```
                  ┌──────────────────────────────┐
                  │      User Browser Client     │
                  └──────────────┬───────────────┘
                                 │
                                 ▼ (Next.js App)
                  ┌──────────────────────────────┐
                  │      Vercel (Hobby: 0$)      │
                  └──────┬────────────────┬──────┘
                         │                │
     (Metadata: < 150MB) │                │ (MDX Files: 50GB)
                         ▼                ▼
                ┌────────────────┐┌────────────────┐
                │ Supabase Free  ││ Cloudflare R2  │
                │ Database (0$)  ││  Bucket ($0.60)│
                └────────────────┘└────────────────┘
```

---

## 2. 🛡️ The "Zero Credit Card Required" Progressive Strategy

Enterprise object storage (like Cloudflare R2) requires linking a credit card to activate the service, even if you remain inside the 10 GB free tier. 

To eliminate this hurdle at launch, the OpenPrimer engine is built with a **graceful degradation** mechanism inside `web/src/lib/r2.ts`:
*   **Zero Configuration Fallback:** The helper functions (`uploadToR2`, `getFromR2`, `deleteFromR2`) automatically check if the R2 environment variables are defined. 
*   **Graceful Behavior:** If the keys are missing, the system prints a developer warning and falls back smoothly, saving or reading the contents from alternative sources (such as the standard relational database) **without throwing runtime crashes or build failures**.
*   **Action Plan:**
    1.  **Launch Phase (0$ / No Card):** Store MDX course content inside the PostgreSQL `lessons` table on Supabase. Since your first 1,000 courses will only take up ~100 MB of space, you stay 100% free on Vercel and Supabase **without entering a credit card anywhere**.
    2.  **Scale Phase (0.60$ / Card Required):** When your database starts approaching the 500 MB limit, simply set up Cloudflare R2, input the environment keys on Vercel, and the application instantly switches to offloading all course assets to R2.

---

## 3. 🖥️ Database & Hosting Environment Variables Audit

To deploy OpenPrimer on Vercel and establish connection channels with Supabase and our external providers, configure the following non-GitHub system environment variables:

### A. Core Database (Supabase) Connection
These variables connect the Next.js frontend with the Supabase PostgreSQL backend.

*   `NEXT_PUBLIC_SUPABASE_URL`
    *   **Description:** The HTTP API endpoint of your Supabase project.
    *   **Scope:** Public (Safe for client and browser runtime).
    *   **Example:** `https://cayylzaasyqqpvuezufy.supabase.co`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   **Description:** The anonymous API key utilized by the client to interact with public tables under Row Level Security.
    *   **Scope:** Public (Safe for client and browser runtime).
    *   **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
*   `SUPABASE_SERVICE_ROLE_KEY`
    *   **Description:** The administrative master key that bypasses Row Level Security (RLS).
    *   **Scope:** **Private / Server-Side Only** (Never expose to browser).
    *   **Example:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
*   `SUPABASE_DB_PASSWORD`
    *   **Description:** The direct database password for the raw PostgreSQL driver connection. Necessary for executing migrations and running fresh seeding scripts.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `MySuperSecurePassword123!`

### B. AI Engine & Platform Services
These variables activate transactional emails, support routing, and the Gemini pedagogical AI Tutor.

*   `GEMINI_API_KEY`
    *   **Description:** Your Google AI Studio API key used to execute the Socratic AI generation and deep pedagogical revision pipelines.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `AIzaSyB_...`
*   `RESEND_API_KEY`
    *   **Description:** Transactional email API key used to send welcome emails, onboarding triggers, and feedback receipts. If missing, the app logs emails to the console.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `re_123456789...`
*   `SUPPORT_EMAIL_REDIRECTION`
    *   **Description:** The destination email address where support forms, feedback submissions, and logs are redirected.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `support@openprimer.app`

### C. Hybrid Cloudflare R2 Storage (Optional at Launch)
These variables configure the S3-compatible Cloudflare R2 bucket. Keep them blank during the launch phase.

*   `CLOUDFLARE_R2_ACCESS_KEY_ID`
    *   **Description:** The Access Key ID generated within your Cloudflare dashboard for the R2 API token.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `c123456789abcdef...`
*   `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
    *   **Description:** The Secret Access Key generated for the R2 API token.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `abcdef1234567890abcdef...`
*   `CLOUDFLARE_R2_ENDPOINT`
    *   **Description:** The custom S3 API endpoint for your Cloudflare account.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `https://your-account-id.r2.cloudflarestorage.com`
*   `CLOUDFLARE_R2_BUCKET_NAME`
    *   **Description:** The target bucket name designated to host course resources and MDX payloads.
    *   **Scope:** **Private / Server-Side Only**.
    *   **Example:** `openprimer-pedagogical-bucket`
