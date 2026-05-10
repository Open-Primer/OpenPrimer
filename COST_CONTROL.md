# 🛡️ OpenPrimer: Cost Control & Security Guide

Protect your Google Cloud budget by following these industrial security steps.

## 1. Google Cloud Quota Limits (The "Hard Cap")
This prevents any runaway spending by stopping the API once a daily limit is reached.

1. Go to **Google Cloud Console** > **IAM & Admin** > **Quotas**.
2. Search for **"Vertex AI API"**.
3. Look for **"Online prediction requests per minute"** (or tokens per day).
4. Click **Edit Quotas** and set a limit that fits your budget (e.g., 50,000 tokens/day).

## 2. Setting a Daily/Monthly Budget Alert
1. Go to **Billing** > **Budgets & Alerts**.
2. Create a new budget named "OpenPrimer Alpha".
3. Set the **Target Amount** (e.g., $50/month).
4. Configure **Thresholds**: 
   - 50% ($25) -> Send Email Alert.
   - 90% ($45) -> Send Email Alert.

## 3. Web Rate Limiting (The "Spam Shield")
OpenPrimer now includes a middleware to limit user requests.
- **Limit**: 10 requests / minute / IP.
- **Technology**: Next.js Middleware.

---
*Financial Security • OpenPrimer Industrialization*
