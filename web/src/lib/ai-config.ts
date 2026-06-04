/**
 * Central AI Model Configuration — OpenPrimer
 * 
 * Single source of truth for:
 * - Which model is used for which task
 * - Vertex AI pricing per 1M tokens (USD) — June 2026
 * - Cost estimation helpers for the admin dashboard
 * 
 * ⚠️  gemini-1.5-flash was retired June 1, 2026 — do NOT use it.
 * 
 * Vertex AI Pricing (generative AI, pay-as-you-go, non-cached):
 * https://cloud.google.com/vertex-ai/generative-ai/pricing
 */

export type ModelId =
  | 'gemini-2.5-flash'     // Best cost/quality balance — primary workhorse
  | 'gemini-2.5-pro'       // Highest quality — course chapter generation only
  | 'gemini-2.0-flash-lite'; // Cheapest — simple tasks (badges, analytics)

/** Vertex AI pricing in USD per 1M tokens (input / output) */
export const MODEL_PRICING: Record<ModelId, { inputPer1M: number; outputPer1M: number; label: string }> = {
  'gemini-2.5-flash': {
    inputPer1M:  0.075,  // $0.075 / 1M input tokens
    outputPer1M: 0.30,   // $0.30  / 1M output tokens
    label: 'Gemini 2.5 Flash'
  },
  'gemini-2.5-pro': {
    inputPer1M:  1.25,   // $1.25  / 1M input tokens (≤200k ctx)
    outputPer1M: 10.00,  // $10.00 / 1M output tokens
    label: 'Gemini 2.5 Pro'
  },
  'gemini-2.0-flash-lite': {
    inputPer1M:  0.0375, // $0.0375 / 1M input tokens — cheapest
    outputPer1M: 0.15,   // $0.15   / 1M output tokens
    label: 'Gemini 2.0 Flash Lite'
  }
};

/**
 * Model assignment per task.
 * Optimization strategy:
 * - Course generation  → Pro (quality matters, few calls)
 * - Tutor chat         → Flash (frequent, needs to be fast & cheap)
 * - Translation        → Flash (repetitive, structured output)
 * - Analytics/Badges   → Flash Lite (simple, lowest cost)
 */
export const TASK_MODELS: Record<string, ModelId> = {
  course_generation:  'gemini-2.5-pro',       // High quality for content creation
  course_translation: 'gemini-2.5-flash',     // Good quality for academic translation
  tutor_chat:         'gemini-2.5-flash',     // Fast & cheap for real-time chat
  jit_translate:      'gemini-2.5-flash',     // Inline lesson translation
  batch_translate:    'gemini-2.5-flash',     // Batch field translation
  analytics:          'gemini-2.0-flash-lite', // Simple report generation
  badge_expand:       'gemini-2.0-flash-lite', // Simple prompt expansion
};

/**
 * Estimate the cost of a call in USD.
 * @param model  The model ID
 * @param inputTokens  Estimated input tokens
 * @param outputTokens Estimated output tokens
 * @returns Cost in USD
 */
export function estimateCost(model: ModelId, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return 0;
  return (inputTokens / 1_000_000) * pricing.inputPer1M 
       + (outputTokens / 1_000_000) * pricing.outputPer1M;
}

/** Typical token estimates per task (for admin cost display) */
export const TASK_TOKEN_ESTIMATES: Record<string, { inputTokens: number; outputTokens: number }> = {
  course_generation:  { inputTokens: 2_000,  outputTokens: 8_000  }, // per lesson
  course_translation: { inputTokens: 8_000,  outputTokens: 7_000  }, // per lesson
  tutor_chat:         { inputTokens: 4_000,  outputTokens: 800    }, // per exchange
  jit_translate:      { inputTokens: 6_000,  outputTokens: 5_500  }, // per page
  batch_translate:    { inputTokens: 1_500,  outputTokens: 1_200  }, // per batch
  analytics:          { inputTokens: 2_000,  outputTokens: 1_000  }, // per report
  badge_expand:       { inputTokens: 300,    outputTokens: 150    }, // per badge
};

/** Cost per task call in USD (pre-computed) */
export const COST_PER_CALL: Record<string, number> = Object.fromEntries(
  Object.entries(TASK_MODELS).map(([task, model]) => {
    const { inputTokens, outputTokens } = TASK_TOKEN_ESTIMATES[task] ?? { inputTokens: 1000, outputTokens: 500 };
    return [task, estimateCost(model, inputTokens, outputTokens)];
  })
);
