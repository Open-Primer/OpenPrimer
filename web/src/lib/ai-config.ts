/**
 * Central AI Model Configuration — OpenPrimer
 * 
 * Single source of truth for:
 * - Which model is used for which task
 * - Vertex AI pricing per 1M tokens (USD)
 * - Cost estimation helpers for the admin dashboard
 * 
 * Vertex AI Pricing (generative AI, pay-as-you-go, non-cached):
 * https://cloud.google.com/vertex-ai/generative-ai/pricing
 */

export type ModelId =
  | 'gemini-3.5-flash-lite' // Ultra-low-cost default for all tasks ($0.30 in / $2.50 out)
  | 'gemini-3.5-flash';     // Standard flash for complex tasks

/** Vertex AI pricing in USD per 1M tokens (input / output) */
export const MODEL_PRICING: Record<ModelId, { inputPer1M: number; outputPer1M: number; label: string }> = {
  'gemini-3.5-flash-lite': {
    inputPer1M:  0.30,   // $0.30 / 1M input tokens
    outputPer1M: 2.50,   // $2.50 / 1M output tokens
    label: 'Gemini 3.5 Flash Lite'
  },
  'gemini-3.5-flash': {
    inputPer1M:  1.50,   // $1.50 / 1M input tokens
    outputPer1M: 9.00,   // $9.00 / 1M output tokens
    label: 'Gemini 3.5 Flash'
  }
};

/**
 * Model assignment per task.
 *
 * ⚠️ MODEL ROUTING POLICY:
 * All automated course generation, widgets placement, translation, tutor chat,
 * analytics, and badges use the ultra-low-cost gemini-3.5-flash-lite ($0.30 in / $2.50 out).
 */
export const TASK_MODELS: Record<string, ModelId> = {
  course_generation:  (process.env.GEMINI_GENERATION_MODEL as ModelId) || 'gemini-3.5-flash-lite',
  widget_placement:   'gemini-3.5-flash-lite',
  widgets_workshop:   'gemini-3.5-flash-lite',
  course_translation: 'gemini-3.5-flash-lite',
  tutor_chat:         'gemini-3.5-flash-lite',
  batch_translate:    'gemini-3.5-flash-lite',
  analytics:          'gemini-3.5-flash-lite',
  badge_expand:       'gemini-3.5-flash-lite',
  badge_compile:      'gemini-3.5-flash-lite',
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
  widget_placement:   { inputTokens: 4_000,  outputTokens: 4_000  }, // per lesson widget batch — Stage 3B/4B (automated pipeline)
  widgets_workshop:   { inputTokens: 6_000,  outputTokens: 6_000  }, // per Atelier session — custom interactive widget (manual, high-quality)
  course_translation: { inputTokens: 8_000,  outputTokens: 7_000  }, // per lesson
  tutor_chat:         { inputTokens: 4_000,  outputTokens: 800    }, // per exchange
  batch_translate:    { inputTokens: 1_500,  outputTokens: 1_200  }, // per batch
  analytics:          { inputTokens: 2_000,  outputTokens: 1_000  }, // per report
  badge_expand:       { inputTokens: 300,    outputTokens: 150    }, // per badge
  badge_compile:      { inputTokens: 1_200,  outputTokens: 800    }, // per compile
};

/** Cost per task call in USD (pre-computed) */
export const COST_PER_CALL: Record<string, number> = Object.fromEntries(
  Object.entries(TASK_MODELS).map(([task, model]) => {
    const { inputTokens, outputTokens } = TASK_TOKEN_ESTIMATES[task] ?? { inputTokens: 1000, outputTokens: 500 };
    return [task, estimateCost(model, inputTokens, outputTokens)];
  })
);
