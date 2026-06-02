# Technical Documentation: GitOps Architecture, AI Governance & Hybrid R2 Storage
## OpenPrimer Global Pedagogical Repository

This document details the operational mechanics, communication protocols, security guardrails, and setup guidelines for OpenPrimer's real-time, bi-directional, version-controlled sync pipeline.

---

## 1. Architectural Overview

OpenPrimer uses a **GitOps** content paradigm. The public GitHub repository serves as the absolute source of truth for pedagogical content in Markdown/MDX formats (`/content`), while the Supabase PostgreSQL database manages the application's dynamic states (user enrollment, progress, analytics, metadata).

```
   ┌────────────────────────────────────────────────────────┐
   │                PUBLIC GITHUB REPOSITORY                │
   │            (/content folder, .mdx format)             │
   └───────────────▲────────────────────────▲───────────────┘
                   │                        │
       [Step A: REST API (PUT/DEL)]         │ [Step B: Webhook PUSH]
                   │                        │
   ┌───────────────┴────────────────────────┴───────────────┐
   │               NEXT.JS WEB APPLICATION                  │
   │           (Hosted on Vercel, Free Tier)                │
   └───────────────┬────────────────────────────────────────┘
                   │
                   ▼
   ┌────────────────────────────────────────────────────────┐
   │            SUPABASE & CLOUDFLARE R2 BUCKET             │
   │      (Relational metadata & Object R2 Storage)         │
   └────────────────────────────────────────────────────────┘
```

---

## 2. Outbound Pipeline (App $\to$ GitHub): Real-Time Creation & Archival

All course additions and deletion operations initiated inside the Next.js server (AI-generated courses or admin actions) are committed to GitHub in real-time using the **GitHub REST API**. This bypasses local file system limits in serverless (Vercel) environments.

### A. Real-Time Generation & Updates (`web/src/lib/github.ts`)
*   **Function:** `pushToGitHub(path, content, message)`
*   **Mechanics:**
    1.  Queries the GitHub API to fetch the current file's unique hash (`SHA`). This is required by GitHub for any update operation.
    2.  Encodes the MDX payload into Base64 format to support UTF-8 strings cleanly.
    3.  Performs a `PUT` request to:
        `PUT /repos/{owner}/{repo}/contents/{path}`
    4.  Creates a commit and pushes the updated file directly to the `main` branch.

### B. Course Archival Level 3 - Physical Deletion
*   **Function:** `deleteFromGitHub(path, message)`
*   **Mechanics:**
    1.  When a course's `archivingLevel` is set to `3` (Suppression/Deletion), the database row is deleted or deactivated.
    2.  The GitHub client fetches the file's current `SHA` and performs a `DELETE` request:
        `DELETE /repos/{owner}/{repo}/contents/{path}`
    3.  **History Preservation Safeguard:** In Git, a deletion commit removes the file from the current HEAD branch. However, **the entire commit history remains intact.** Old revisions can be restored or consulted retroactively in the Git logs, ensuring compliance with Open-Source principles.

---

## 3. Inbound Pipeline (GitHub $\to$ App): Webhook & AI Self-Healing Governance

When changes are pushed directly to GitHub (e.g., community Pull Requests or direct commits), GitHub calls our secure API endpoint `/api/webhooks/github-sync` in real-time to import and validate changes.

### A. Cryptographic Signature Verification
To prevent malicious access, the webhook computes a `HMAC SHA-256` signature using a shared secret (`GITHUB_WEBHOOK_SECRET`) and compares it securely with the `x-hub-signature-256` header. Unauthorized requests are immediately rejected with a `401 Unauthorized` status.

### B. AI Pedagogical Guardrail (`validatePedagogicalContent`)
For every incoming `.mdx` file, the AI Governance Agent applies strict rules:
1.  **Size Restriction:** Rejects files under 150 characters (protects against accidental truncation or empty-file sabotage).
2.  **Frontmatter Integrity:** MDX files must parse successfully using `gray-matter` and contain a valid metadata block.
3.  **Anti-Sabotage Heuristics:** Scans for prohibited code injections (`<script`, `eval(`, etc.) and dummy text patterns ("Lorem Ipsum", "test test test").

### C. Self-Healing Revert Pipeline
If a file fails validation, the system initiates an automated self-healing loop:
*   The Supabase production database **is not updated** (retains the last verified state).
*   A rejection log is generated in the `refused_revisions` table for admin review.
*   **Self-Healing Revert Commit:**
    *   *If the course already existed:* The endpoint queries the database for the last clean, verified content and **commits a revert overwrite back to GitHub** using the REST API: `revert(content): AI Agent restored last valid lesson contents [anti-sabotage self-healing]`.
    *   *If it was an unverified new file:* The endpoint **commits a deletion** to purge it: `revert(content): AI Agent removed unverified new lesson [anti-sabotage self-healing]`.

---

## 4. Versioning & Progression Tracking

To prevent user progress from breaking when content is revised:
1.  When a set of MDX lessons is successfully synchronized, the system queries the current version of the course in Supabase (e.g., `1.0.4`).
2.  **Automatic Semantic Incrementation:** The system increments the patch version (e.g., `1.0.4` $\to$ `1.0.5`).
3.  The `last_revision_date` is updated to the current timestamp.
4.  This version number ensures enrolled students can track their progress against a specific syllabus revision and choose when to upgrade to newer versions.

---

## 5. Cloudflare R2 Progressive Integration (`web/src/lib/r2.ts`)

To avoid Supabase Pro limits as the catalog grows, we have implemented the underlying infrastructure for a partial migration to **Cloudflare R2 Object Storage**:
*   Uses `@aws-sdk/client-s3` optimized for Vercel/Edge runtimes.
*   **Available Actions:** `uploadToR2`, `getFromR2`, and `deleteFromR2`.
*   **Degradation:** If R2 environment keys are missing, the helper logs a warning and exits gracefully. **You do not need to register a credit card yet; the system is ready for progressive migration when you decide to enable it.**

---

## 6. Environment Variables Setup

Configure these environment variables in your Vercel/Hosting dashboard to activate the features:

```ini
# --- GitHub API & Webhook (100% Free - No Card) ---
GITHUB_ACCESS_TOKEN=your_github_personal_access_token
GITHUB_OWNER=Open-Primer
GITHUB_REPO=OpenPrimer
GITHUB_WEBHOOK_SECRET=your_secure_webhook_secret

# --- Cloudflare R2 (Optional - Key is required only when activated) ---
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=your_r2_bucket_name
```

---

## 7. Configuring the GitHub Webhook

1. Go to your GitHub repository **Settings > Webhooks > Add Webhook**.
2. **Payload URL:** Set this to your application URL followed by the webhook path (e.g., `https://openprimer.vercel.app/api/webhooks/github-sync`).
3. **Content type:** Select `application/json`.
4. **Secret:** Input the same value as defined in `GITHUB_WEBHOOK_SECRET`.
5. **Events:** Check *"Just the push event"*.
6. Click **Add Webhook**. Your real-time sync and self-healing governance pipeline is now active!
