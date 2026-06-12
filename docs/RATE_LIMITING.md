# ⚙️ Vertex AI Rate Limiting & Pipeline Concurrency

## Overview

This document describes the 3-layer throttling system implemented in OpenPrimer to maximize curriculum generation throughput while avoiding Vertex AI `429 RESOURCE_EXHAUSTED` errors.

The system is **fully configurable** without code changes — via environment variables and database parameters.

---

## The Problem

Each course generation task involves many sequential Vertex AI calls:

```
Lesson N:
  ├── Agent 1/2/3 (content generation)  → 1 call
  ├── Agent 4 (verification)            → 1 call
  ├── Agent 4 (refinement, if rejected) → 1–2 calls
  └── Self-healing MDX (if failed)      → 1 call

Total per lesson: 3–5 Vertex AI calls
Total per 5-lesson course: 15–25 calls
Total for 2 concurrent courses: 30–50 calls/run
```

With default Vertex AI quotas (~10 RPM for gemini-2.5-pro), concurrent courses hit rate limits almost immediately.

---

## Layer 1 — SQL Concurrency Gate (`claim_next_task`)

**File:** `web/src/lib/supabase_schema.sql`  
**Function:** `public.claim_next_task()`

Before claiming any task from the queue, the SQL function now checks how many tasks are currently `running`. If that count meets or exceeds the configured maximum, **no task is claimed** — the cron will retry on the next tick.

### Configuration

Set the `maxConcurrentWorkers` key in the `system_parameters` table:

```sql
INSERT INTO public.system_parameters (key, value)
VALUES ('maxConcurrentWorkers', '2')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
```

| Value | Effect |
|-------|--------|
| `'1'` | Fully sequential — safest, slowest |
| `'2'` | **Default** — 2 parallel course generations |
| `'3'` | Requires increased Vertex AI quota (see §5) |

> [!IMPORTANT]
> After modifying this SQL function, you must **apply it to your live Supabase instance** via the SQL Editor or `psql`. The schema file is the canonical source of truth but changes are not auto-deployed.

---

## Layer 2 — Token Bucket Rate Limiter (`vertex-client.ts`)

**File:** `web/src/lib/vertex-client.ts`  
**Variable:** `VERTEX_RATE_LIMIT_RPM`

A module-level **token bucket** sits in front of every `callVertexAI()` call. It enforces a global requests-per-minute ceiling shared across all active workers in the same Node.js process.

When the bucket is empty, calls **wait** (rather than fail) until a token is available, automatically smoothing burst traffic.

### Configuration

Set via environment variable in `.env.local` (or Vercel/Cloud Run env):

```bash
# web/.env.local
VERTEX_RATE_LIMIT_RPM=8   # default: 8 req/min
```

### Tuning Guide

| Your Vertex AI RPM quota | Recommended `VERTEX_RATE_LIMIT_RPM` |
|--------------------------|--------------------------------------|
| Default (~10 RPM pro)    | `8` (conservative buffer)            |
| Requested increase: 30   | `20`                                 |
| Requested increase: 60   | `40`                                 |
| Requested increase: 120  | `80`                                 |

> [!TIP]
> Always set `VERTEX_RATE_LIMIT_RPM` to ~70% of your actual quota. The remaining 30% acts as headroom for retries and the AI Studio fallback path.

---

## Layer 3 — Inter-Lesson Delay (`ai.ts`)

**File:** `web/src/lib/ai.ts`  
**Variable:** `INTER_LESSON_DELAY_MS`

Within a single course generation run, a configurable pause is inserted **between each lesson**. This prevents the burst pattern where all lessons of a course fire simultaneously at the start.

### Configuration

Set via environment variable:

```bash
# web/.env.local
INTER_LESSON_DELAY_MS=5000   # default: 5000ms (5 seconds)
```

| Value | Effect |
|-------|--------|
| `0` | Disabled — lessons fire as fast as possible |
| `3000` | 3s gap — light throttling |
| `5000` | **Default** — 5s gap, good balance |
| `10000` | 10s gap — maximum safety margin |

---

## Layer 4 — Exponential Backoff (`vertex-client.ts`)

Already implemented as a safety net. When a `429` slips through the rate limiter (e.g. during quota refresh windows), the client automatically retries with exponential backoff:

```
Attempt 1 → fail 429 → wait 2s
Attempt 2 → fail 429 → wait 5s
Attempt 3 → fail 429 → wait 12.5s
Fallback  → switch model (flash → pro)
```

This layer requires **no configuration** — it is always active.

---

## Layer 5 — Increasing Your Vertex AI Quota (Google Cloud Console)

This is the most impactful long-term fix. To request a quota increase:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Navigate to: **IAM & Admin → Quotas & System Limits**
3. Filter by: `Vertex AI API`
4. Find these quotas (filter by your project `openprimer-free`):
   - `Generate content requests per minute per project per base model per region` — for `gemini-2.5-pro`
   - Same for `gemini-2.5-flash`
5. Click **Edit Quotas** → enter desired limit → submit
6. Google typically responds within **24–48 hours** (free request for reasonable amounts)

> [!NOTE]
> Default quotas as of 2026:
> - `gemini-2.5-pro`: ~10 RPM
> - `gemini-2.5-flash`: ~60 RPM
>
> Requesting 30–60 RPM for `gemini-2.5-pro` is a reasonable first ask.

After quota increase, update your env vars accordingly:
```bash
VERTEX_RATE_LIMIT_RPM=40        # 70% of new 60 RPM quota
# Optional: reduce delay since you have more headroom
INTER_LESSON_DELAY_MS=2000
```
And in DB:
```sql
UPDATE public.system_parameters SET value = '3' WHERE key = 'maxConcurrentWorkers';
```

---

## Summary — Default Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  Layer                 │ Parameter              │ Default   │
├─────────────────────────────────────────────────────────────┤
│  1. SQL concurrency    │ maxConcurrentWorkers   │ 2         │
│  2. Token bucket RPM  │ VERTEX_RATE_LIMIT_RPM  │ 8         │
│  3. Inter-lesson wait  │ INTER_LESSON_DELAY_MS  │ 5000 ms   │
│  4. Backoff (auto)     │ (not configurable)     │ 2→5→12.5s │
└─────────────────────────────────────────────────────────────┘
```

With these defaults and the standard Vertex AI quota:
- **Max concurrent courses**: 2
- **Max effective call rate**: ~8 RPM (well under the ~10 RPM pro limit)
- **Expected 429 rate**: near 0% for normal operation

---

## Applying the SQL Change to Production

The `supabase_schema.sql` file is the canonical schema. To apply the updated `claim_next_task` function to your live Supabase instance:

```bash
# Option A: Supabase SQL Editor (recommended)
# Copy the CREATE OR REPLACE FUNCTION block from supabase_schema.sql
# and run it in the Supabase dashboard SQL Editor.

# Option B: psql direct
psql "$SUPABASE_DB_URL" -c "\i web/src/lib/supabase_schema.sql"
```

Or use the `db_deploy.js` script if available:
```bash
cd web
node db_deploy.js
```
