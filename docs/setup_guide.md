# 🚀 OpenPrimer Infrastructure & Deployment Setup Guide
## Google Cloud OAuth, Supabase, Resend, Cloudflare R2 & Mobile Building

This guide details the complete configuration process to transition OpenPrimer from local development to production.

---

## 📂 Table of Contents
1. [🌐 Google Cloud Console Setup (OAuth 2.0)](#1-google-cloud-console-setup-oauth-20)
2. [⚡ Supabase Setup & Authentication Setup](#2-supabase-setup-amp-authentication-setup)
3. [🗄️ Database Schema & Seeding (Tutors, Badges)](#3-database-schema-amp-seeding-tutors-badges)
4. [📧 Resend Email Domain Setup](#4-resend-email-domain-setup)
5. [☁️ Cloudflare R2 Storage (Optional at Launch)](#5-cloudflare-r2-storage-optional-at-launch)
6. [🖥️ Production Environment Variables Audit](#6-production-environment-variables-audit)
7. [🩺 Admin Key Hot-Swapping & Diagnoses](#7-admin-key-hot-swapping-amp-diagnoses)
8. [📱 Mobile Application Building](#8-mobile-application-building)

---

## 1. 🌐 Google Cloud Console Setup (OAuth 2.0)

To support **Sign in with Google** across your applications:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `OpenPrimer-Prod`).
3. Under **APIs & Services** > **OAuth consent screen**, set user type to **External**. Fill in name as `OpenPrimer`, and add your support email address.
4. Under **Authorized Domains**, register `openprimer.app` and `supabase.co`.
5. Under **Credentials**, click **Create Credentials** > **OAuth client ID**. Set the type to **Web application**.
6. **Authorized JavaScript origins**:
   * `http://localhost:3000` (Local Dev)
   * `https://openprimer.app` (Production Domain)
7. **Authorized redirect URIs**: Set this to your Supabase project Callback URL:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
8. Save and copy the **Client ID** and **Client Secret**.

---

## 2. ⚡ Supabase Setup & Authentication Setup

1. Open your [Supabase Dashboard](https://supabase.com/).
2. Navigate to **Authentication** > **Providers** > **Google**.
3. Toggle the provider state to **Enabled** and paste your Google OAuth **Client ID** and **Client Secret**.
4. Under **URL Configuration**, set the **Site URL** to `https://openprimer.app` and add Redirect URIs:
   * `http://localhost:3000/**`
   * `https://openprimer.app/**`

---

## 3. 🗄️ Database Schema & Seeding (Tutors, Badges)

Before launching, you must initialize tables and seed administrative achievements and dynamic AI tutor profiles.

### Step 1: Initialize Database Tables
Navigate to the **SQL Editor** inside your Supabase Dashboard, create a new query, paste the content of [supabase_schema.sql](file:///c:/Silvere/Encours/Developpement/OpenPrimer/web/src/lib/supabase_schema.sql), and click **Run**. This establishes schema constraints and Row Level Security (RLS) policies.

### Step 2: Seed Academic Metadata
We provide an automated utility script to populate databases instantly with initial standard entities (languages, 8 AI Tutor personalities, 25 Achievements/Badges):
1. In your `.env.local` config, register administrative connection keys:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `SUPABASE_DB_PASSWORD` (Database password for Postgres direct driver connection)
2. Run this command inside the `/web` directory:
   ```bash
   node scripts/seed_fresh_database.js
   ```

---

## 4. 📧 Resend Email Domain Setup

If `RESEND_API_KEY` is present, OpenPrimer dispatches real emails; if missing, it falls back to console logging logs.
1. Sign up on [Resend](https://resend.com/) and go to **API Keys** to generate a key.
2. Go to **Domains** > **Add Domain** and input `openprimer.app`.
3. Add the generated **SPF**, **DKIM**, and **DMARC** DNS records into your domain registrar (e.g. Cloudflare). Click **Verify**.

---

## 5. ☁️ Cloudflare R2 Storage (Optional at Launch)

OpenPrimer implements a **progressive storage strategy**. By default, lessons MDX files are saved within PostgreSQL on Supabase. As your catalog scales beyond Supabase's **500MB free database tier**, you can enable Cloudflare R2 object storage to host the MDX payloads:

*   **No Credit Card Required at Launch:** Keep Cloudflare R2 environment variables undefined. The Next.js server (`web/src/lib/r2.ts`) degrades gracefully, maintaining database storage without throwing errors.
*   **Activating R2:** When database limits are reached, create an S3-compatible R2 bucket in Cloudflare, retrieve your keys, and declare the environment variables on Vercel. The system automatically shifts payloads to R2.

---

## 6. 🖥️ Production Environment Variables Audit

Declare these environment variables in your Next.js Vercel hosting platform dashboard:

| Variable Name | Description | Scope / Recommendation |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project API endpoint | Public (Web browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for RLS | Public (Web browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | Administrative secret bypass key | **Private (Server Side Only)** |
| `SUPABASE_DB_PASSWORD` | Direct PostgreSQL connection password | **Private (Server Side Only)** |
| `GEMINI_API_KEY` | Google Vertex/Gemini AI API key | **Private (Server Side Only)** |
| `RESEND_API_KEY` | Transactional email dispatch key | **Private (Server Side Only)** |
| `SUPPORT_EMAIL_REDIRECTION` | Destination for student feedbacks | **Private (Server Side Only)** |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 Bucket Token Access Key ID | Optionnel (R2 storage) |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY`| R2 Bucket Token Secret Access Key | Optionnel (R2 storage) |
| `CLOUDFLARE_R2_ENDPOINT` | Custom S3 endpoint URL for your R2 | Optionnel (R2 storage) |
| `CLOUDFLARE_R2_BUCKET_NAME` | Cloudflare R2 bucket name | Optionnel (R2 storage) |

---

## 7. 🩺 Admin Key Hot-Swapping & Diagnoses

In the administrative portal (`/admin/health`), API key status checking is strictly isolated:
*   **Security Gating:** Probing routes are session-gated to prevent footprinting.
*   **Hot-Swapping Sandbox:** Admin key swapping inputs in the browser exist strictly in local client memory. They **do not** overwrite server environment variables.
*   **Resolving Health Errors:** If Resend or Gemini report errors on the Health dashboard, verify that the matching keys are entered inside the permanent hosting platform container dashboard (e.g. Vercel dashboard) and perform a **Redeploy**.

---

## 8. 📱 Mobile Application Building & App Store Deployments

OpenPrimer provides a standalone hybrid mobile client designed as an optimized WebView in the `/mobile` directory.

### Step 1: Install Dependencies
Navigate to the `/mobile` directory and install the required dependencies:
```bash
npm install
```

### Step 2: Environment Configuration (`config.json`)
Configure the target URL of your live OpenPrimer web application in the `/mobile/config.json` file:
```json
{
  "BASE_URL": "https://openprimer.vercel.app"
}
```

### Step 3: Launching in Development
To run the mobile application locally on an emulator or physical device (via the Expo Go app or local native builds):
```bash
# Start the app on an Android emulator
npm run android

# Start the app on an iOS emulator
npm run ios
```

### Step 4: Production Compilation (Google Play Store & Apple App Store)
We use **EAS Build** (Expo Application Services) to securely compile your production applications directly in the cloud.

1. **Install EAS CLI Globally:**
   ```bash
   npm install -g eas-cli
   ```
2. **Log in to your Expo account:**
   ```bash
   eas login
   ```
3. **Configure EAS Environment:**
   ```bash
   eas build:configure
   ```
4. **Launch production Android build (.aab):**
   ```bash
   npm run build:android
   ```
5. **Launch production iOS build (.ipa):**
   ```bash
   npm run build:ios
   ```

For a comprehensive guide describing the configuration of the **Google Play Console**, **App Store Connect**, and distribution on the **Chrome Web Store** for the web version, please refer to our local [Compilation & Publication Guide](file:///c:/Silvere/Encours/Developpement/OpenPrimer/docs/BUILD_AND_PUBLISH_GUIDE.md).

### Native Advanced Features Implemented

*   **Android Back Button Handling:** Pressing the Android physical "Back" button navigates backward in the WebView's history instead of abruptly closing the application.
*   **Background Synchronization:** When the student is online and views their curriculum page (`/profile/curriculum`), the website automatically and invisibly sends their active courses list to the mobile container over the native communication bridge.
*   **Premium Offline Mode:** If there is no internet connection at startup or mid-navigation, the WebView gracefully yields to a beautiful native Slate-950 offline screen, displaying active courses retrieved from persistent local storage (`AsyncStorage`). The student can click a native "Retry" button to reload the WebView at any time.


