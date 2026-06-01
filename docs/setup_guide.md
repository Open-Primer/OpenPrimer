# 🚀 OpenPrimer Production Server-Side & Infrastructure Setup Guide

This guide provides a comprehensive walkthrough for configuring the server-side components of **OpenPrimer**. Learn how to configure **Google OAuth (Google Cloud Console)**, **Supabase Database & Authentication**, and the **Resend Email API** to transition OpenPrimer from a local development sandbox to a secure, highly scalable production environment under the `openprimer.app` domain.

---

## 📂 Table of Contents
1. [🌐 Google Cloud Console Setup (OAuth 2.0)](#1-google-cloud-console-setup-oauth-20)
2. [⚡ Supabase Console & Auth Provider Setup](#2-supabase-console-amp-auth-provider-setup)
3. [🗄️ Supabase Database Schema & Automated Seeding](#3-supabase-database-schema-amp-automated-seeding)
4. [📧 Resend Email API Integration & Domain Verification](#4-resend-email-api-integration-amp-domain-verification)
5. [🖥️ Production Environment Variables Audit](#5-production-environment-variables-audit)
6. [🩺 Admin Health Diagnostics & API Key Protections](#6-admin-health-diagnostics-amp-api-key-protections)

---

## 1. 🌐 Google Cloud Console Setup (OAuth 2.0)

To enable **Sign in with Google** across your login and signup screens, you must register OpenPrimer as an OAuth application in the Google Cloud Console.

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top navigation bar and select **New Project**.
3. Name your project (e.g., `OpenPrimer-Prod`) and click **Create**.

### Step 2: Configure the OAuth Consent Screen
1. In the sidebar, navigate to **APIs & Services** > **OAuth consent screen**.
2. Select **External** (unless you are deploying within a closed Google Workspace organization) and click **Create**.
3. Fill in the **App Information**:
   - **App name**: `OpenPrimer`
   - **User support email**: `support@openprimer.app`
   - **Authorized domains**: Enter your production domain `openprimer.app` and `supabase.co`.
4. Under **Scopes**, click **Add or Remove Scopes** and select:
   - `.../auth/userinfo.email` (Read email addresses)
   - `.../auth/userinfo.profile` (Read personal profile info)
   - `openid` (Authenticate using OpenID Connect)
5. Add your own email to **Test Users** (crucial if your consent screen remains in "Testing" mode).

### Step 3: Create OAuth 2.0 Credentials
1. In the sidebar, click on **Credentials**.
2. Click **+ Create Credentials** > **OAuth client ID**.
3. Set **Application type** to **Web application**.
4. Set **Name** to `OpenPrimer Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000` (for local development)
   - `https://openprimer.app` (for production)
6. Under **Authorized redirect URIs**, add your **Supabase Callback URL**:
   - Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`
   - *Example:* `https://cayylzaasyqqpvuezufy.supabase.co/auth/v1/callback`
7. Click **Create** and securely copy the generated **Client ID** and **Client Secret**.

---

## 2. ⚡ Supabase Console & Auth Provider Setup

Supabase manages user sessions, profiles, and courses. You must enable Google OAuth inside the Supabase control panel.

### Step 1: Input Google OAuth Credentials
1. Open your [Supabase Dashboard](https://supabase.com/).
2. Select your project and navigate to **Authentication** > **Providers** > **Google**.
3. Toggle the status to **Enabled**.
4. Paste the **Client ID** and **Client Secret** obtained from the Google Cloud Console in the previous section.
5. Save the configuration.

### Step 2: Configure Redirect URLs in Supabase
1. Go to **Authentication** > **URL Configuration**.
2. Set your **Site URL** (this is where users are redirected by default after auth flow):
   - Local: `http://localhost:3000`
   - Production: `https://openprimer.app`
3. Under **Redirect URLs**, add wildcards or specific auth callback handlers:
   - `http://localhost:3000/**`
   - `https://openprimer.app/**`

---

## 3. 🗄️ Supabase Database Schema & Automated Seeding

OpenPrimer enforces granular user privacy through Row Level Security (RLS) tables. You must initialize the database schema and seed the core parameters (Achievements, AI Tutors, Languages) before opening registrations.

### Step 1: Create Database Tables and Triggers
1. Navigate to **SQL Editor** in your Supabase Dashboard.
2. Click **New Query**.
3. Paste the contents of the database schema configuration found in:
   - [supabase_schema.sql](file:///c:/Silvere/Encours/Developpement/OpenPrimer/web/src/lib/supabase_schema.sql)
4. Click **Run** to execute the statements. This creates:
   - `profiles` table (synchronized with auth signup using a Postgres trigger).
   - `enrollments` table (tracking curriculum choices and progression).
   - `search_logs` table (for search telemetry).
   - `contact_feedbacks` table (storing support requests securely).
   - Trigger functions to automate ECTS counting and milestone synchronization.

### Step 2: Automated Database Seeding (Crucial for AI Tutors & Badges)
OpenPrimer includes a secure automated setup utility to instantly populate your empty tables with academic metadata, achievements/badges, standard languages, and core socratic AI Tutor profiles.

1. Ensure your `.env.local` file contains the correct Supabase direct connections keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DB_PASSWORD` (Database password for Postgres direct driver connection)
2. Open a terminal in the `/web` directory and execute:
   ```bash
   node scripts/seed_fresh_database.js
   ```
3. **What this automated script completes:**
   - Truncates operational logs and dynamic tables for a pristine deployment.
   - Registers the 5 standard dynamic UI languages (`FR`, `EN`, `ES`, `DE`, `ZH`).
   - Registers the 8 master AI Tutor personalities (including *Socratic*, *Direct*, *Gamified*, *Feynman*, and *Rigorous Proof*).
   - Populates the 25 standard achievements/badges with translations.
   - Configures secure JWT email-based RLS security policies for administrative access.
   - Purges stale Auth system accounts and creates 4 fresh seeds (1 administrator and 3 mock students).

---

## 4. 📧 Resend Email API Integration & Domain Verification

OpenPrimer implements a dual-mode transactional email dispatch mechanism. If `RESEND_API_KEY` is present on the server, it dispatches real emails; if missing, it falls back gracefully to standard console log simulations.

### Step 1: Obtain the API Key
1. Sign up or log in to [Resend](https://resend.com/).
2. Go to **API Keys** in the sidebar.
3. Click **Create API Key**, configure permissions to *Full Access*, and copy the key (e.g., `re_123456...`).

### Step 2: Verify Your Sending Domain (Crucial for openprimer.app)
By default, unverified Resend accounts can only send emails to the administrator's own account. To dispatch emails to any student sign-up:
1. Go to **Domains** > **Add Domain** inside Resend.
2. Input your production domain: `openprimer.app`.
3. Add the generated DNS records (**SPF**, **DKIM**, **DMARC**) into your DNS dashboard (e.g., Cloudflare, Namecheap, GoDaddy).
4. Wait 5–10 minutes and click **Verify** in Resend.
5. Once verified, update the default sender address in your signup auth config and contact API route:
   - Contact API Sender: `OpenPrimer Feedback <feedback@openprimer.app>`
   - Signup verification Sender: `OpenPrimer <onboarding@openprimer.app>`

---

## 5. 🖥️ Production Environment Variables Audit

Configure the following environment variables in your hosting environment (Vercel, Railway, Render, etc.):

| Variable Name | Description | Example / Recommended Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project API endpoint | `https://cayylzaasyqqpvuezufy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for client side) | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret database management key | *NEVER expose to client; server side only* |
| `SUPABASE_DB_PASSWORD` | Password for PostgreSQL connection | *Secure server-side password for direct seed/migrations* |
| `RESEND_API_KEY` | Transactional email dispatch key | `re_...` |
| `GEMINI_API_KEY` | AI tutor generation & translating engine | `AIzaSy...` |
| `SUPPORT_EMAIL_REDIRECTION` | Destination for support messages | `support@openprimer.app` |

---

## 6. 🩺 Admin Health Diagnostics & API Key Protections

In the OpenPrimer admin interface, you may occasionally see `unauthorized` statuses reported on `/admin/health` during server probes.

### Why is this happening? Is it a bug?
**No, this is expected security behavior.**
1. **Server-Side Protection**: The `/api/health` server-side route enforces strict authorization checks to prevent unauthorized external callers from executing probing routines.
2. **Key Hot-Swapping**: The frontend provides a hot-swap control where you can temporarily test API keys in your browser session. Since browser-based inputs are local, they do **not** alter the permanent server-side environment variables (`.env.local`).
3. **Result**: The backend continues probing with your server-side environment variables. If you see "unauthorized" next to Resend or Gemini, it means the keys registered *directly on the host server* are expired, invalid, or missing, even if you typed a valid one in the browser input.

### Resolving persistent server health warning messages:
Verify that your hosting platform has the matching credentials entered into the actual system environment variables dashboard, followed by a **redeploy** of the server container to capture the new settings.
