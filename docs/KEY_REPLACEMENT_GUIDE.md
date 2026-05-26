# 🔑 Step-by-Step API Key Replacement Guide

This document explains how to substitute the mock developer parameters in **OpenPrimer** with live, production-grade credentials for all integrated services.

---

## 1. 🧠 Google Gemini 1.5 Pro/Flash
Gemini generates the academic curriculum structures, achievement badge prompts, translations, tuteur chat streaming responses, and administrative health reports.

### Step-by-Step Replacement:
1. Navigate to the **[Google AI Studio](https://aistudio.google.com/)**.
2. Click **Create API Key**.
3. Copy your generated key (`AIzaSy...`).
4. Apply the key in either of two ways:
   * **Hot-Swap (Instantly on-the-fly)**: Go to the **Server Health** `/admin/health` tab in your admin dashboard, paste it into the **Gemini 1.5 API Key** input field, and click **Apply Keys**.
   * **Hardcoded (Production environment variables)**:
     * Local dev: Add to your `web/.env.local` file:
       ```env
       GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
       ```
     * Vercel deployment: Set `GEMINI_API_KEY` in the Vercel Dashboard env configurations.

---

## 2. ⚡ Supabase (Database & Authentication)
Supabase handles student curriculum progress, analytics logs, and task scheduling.

### Step-by-Step Replacement:
1. Sign in to your **[Supabase Dashboard](https://supabase.com/)** and create a new project.
2. Go to **Project Settings** > **API**.
3. Retrieve your **Project URL** and your **anon** public API key.
4. Open your SQL Editor in the Supabase Dashboard and run the initial schema script located in:
   [supabase_schema.sql](file:///C:/Silvere/Encours/Developpement/OpenPrimer/web/src/lib/supabase_schema.sql) to initialize tables, relationships, and task queues.
5. Apply the keys:
   * **Hot-Swap (Session only)**: Paste the URL and Anon Key into the Server Health configurator.
   * **Hardcoded (Global)**:
     * Add to `web/.env.local`:
       ```env
       NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
       NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
       ```

---

## 3. 📧 Resend (Transactional Email API)
Resend triggers welcome emails, curriculum milestones notifications, and error alerts.

### Step-by-Step Replacement:
1. Register on **[Resend](https://resend.com/)**.
2. Navigate to **API Keys** > **Create API Key**.
3. Add to your `.env.local` or Vercel Environment Variables:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   ```
4. Verify your sending domain in Resend dashboard to start sending emails to students.
