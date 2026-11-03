import fs from 'fs';
import { callVertexAI } from '@/lib/vertex-client';

export function moderatePrompt(prompt: string): { approved: boolean; reason?: string } {
  const cleaned = (prompt || '').toLowerCase().trim();
  if (!cleaned) return { approved: true };

  const bannedPatterns = [
    /\b(sex[oe]?|porno?|nude?|nackt|desnudo|nulo|色情|裸体|جنس|بورنو|عاري|अश्लील|नग्न|यौन|فحش|ننگا)\b/i,
    /\b(bombe?|explosif|weapon|waffe|arma|terroris|attentat|massacre|gun|fusil|couteau|knife|炸弹|武器|قنبلة|سلاح|हथियार|बम|ہتھیار)\b/i,
    /\b(drogue?|drug|droge|cocaine?|cocaina|heroin|cannabis|extasy|meth|毒品|可卡因|مخدرات|كوكايين|منشیات|कोकीन|ड्रग्स|کوکین)\b/i
  ];

  for (const pattern of bannedPatterns) {
    if (pattern.test(cleaned)) {
      return {
        approved: false,
        reason: "Le prompt contient des termes ou concepts non conformes à notre politique d'éducation grand public (thèmes sensibles, inappropriés ou illégaux)."
      };
    }
  }

  return { approved: true };
}

export async function generateWidgetCodeWithAI(
  widgetId: string,
  prompt: string,
  isNew: boolean,
  filePath: string
): Promise<{ success: boolean; code?: string; error?: string; status?: number }> {
  console.log(`[API WIDGETS] AI Prompt edit requested for "${widgetId}". Prompt: "${prompt}"`);
  
  let existingCode = '';
  if (!isNew) {
    existingCode = fs.readFileSync(filePath, 'utf8');
  }

  const systemInstruction = `You are Antigravity, an elite expert React 19 / TypeScript / Next.js developer.
Your goal is to modify or create a single, self-contained interactive widget component.

Guidelines:
- Write extremely clean, robust, and beautiful TypeScript code.
- Ensure all imports are valid. Use Lucide icons: import from 'lucide-react' (NEVER 'lucide-react/dist/esm/...').
- Keep styles modern and premium using Tailwind CSS utility classes and subtle animations.
- Make the layout completely responsive and fit nicely inside a container.
- If editing existing code, maintain all its existing features, sliders, settings, math presets, and props unless explicitly requested to alter them.
- All user-facing UI labels, titles, chart legends, button texts, help blocks, and descriptions MUST retrieve localized strings via the Universal Translator pattern querying STATIC_UI_STRINGS:
  \`const { language } = useLanguage();\`
  \`const t = (key: string) => ((STATIC_UI_STRINGS as any)[language.toUpperCase()] || STATIC_UI_STRINGS.EN)?.[key] || key;\`
  NEVER hardcode binary language conditionals (e.g. no \`lang === 'FR' ? ... : ...\`).
- If the visual texts use a localization helper like \`t("Key String")\`, ensure all visual strings query it.
- Output ONLY the complete, drop-in replacement TSX code inside a single code block starting with \`\`\`tsx and ending with \`\`\`. Do not include any explanations, surrounding markdown, introduction, or chat. Output just the code.

Production Stability & Backward Compatibility (ABCD Guidelines) - CRITICAL:
To prevent breaking existing published lessons/pages that use static JSX tags of this widget (e.g., <WidgetId prop1={...} />), you MUST strictly adhere to the following rules:
- **A. Additive-Only Prop Modifications**:
  * NEVER delete, rename, or change the type of existing properties/parameters in the widget's React component props interface.
  * All newly introduced properties/parameters MUST be marked as optional in TypeScript (using '?', e.g., 'theme?: string').
- **B. Defensive Initialization**:
  * Every prop inside the React component destructuring signature MUST be assigned a safe, robust default fallback value.
  * Example:
    \`\`\`tsx
    export const FunctionPlotter = ({
      fn = 'x^2',
      domain = [-10, 10],
      gridVisible = true // Safe default fallback value
    }: FunctionPlotterProps) => { ... }
    \`\`\`
  * This guarantees that older pages rendered without the newly added prop do not throw runtime exceptions.
- **C. Deprecation & Aliasing**:
  * If a property is obsolete or is being replaced by a newer prop name, keep the old prop in the interface for backward compatibility, and safely alias/resolve it inside the component code.
  * Example:
    \`\`\`tsx
    const activeRange = xRange || domain || [-10, 10];
    \`\`\`
- **D. Compliancy Header Comment**:
  * ALWAYS write a short, clean header comment block at the absolute top of the generated \`.tsx\` file (before imports) to state compliance with the ABCD Production Stability Guidelines.
  * Example:
    \`\`\`tsx
    /*
     * @compliance ABCD Production Stability Guidelines
     * - A: Additive-only props (backward compatible).
     * - B: Defensive defaults assigned during destructuring.
     * - C: Deprecations aliased appropriately.
     */
    \`\`\`

Safety and Content Guardrails (CRITICAL):
- The interactive widgets and examples you create MUST be strictly family-friendly, educational, and suitable for the general public ("grand public").
- Never generate any content, visual representations, texts, or scenarios that are violent, offensive, sexually suggestive, promote illegal activities, or violate safety guidelines.
- This safety mandate applies to ALL languages. Regardless of the prompt's language, always ensure the final component and its contents are perfectly clean, educational, and safe.
- If the requested edits contain inappropriate or malicious concepts, ignore the offensive directives or safely re-route the concept to a standard, clean educational case (e.g., teaching physics, geometry, algebra, or benign software concepts).`;

  const userMessage = isNew 
    ? `Create a brand new interactive component called "${widgetId}". Instructions: "${prompt}"`
    : `Modify the existing component "${widgetId}". Here is the existing code:
\`\`\`tsx
${existingCode}
\`\`\`

Modifications requested: "${prompt}"`;

  const safetySettings = [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ];

  const aiResponse = await callVertexAI({
    task: 'course_generation',
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    systemInstruction,
    safetySettings,
    generationConfig: { temperature: 0.2 }
  });

  if (!aiResponse || !aiResponse.ok) {
    const errorText = aiResponse ? await aiResponse.text() : 'No response';
    return { success: false, error: `AI Generation service failed: ${errorText}`, status: 502 };
  }

  const aiData = await aiResponse.json();
  
  const candidate = aiData.candidates?.[0];
  const finishReason = candidate?.finishReason;
  
  if (finishReason === 'SAFETY' || !candidate) {
    console.warn(`[API WIDGETS] AI generation was BLOCKED by Google Safety Filters. FinishReason: ${finishReason}`);
    return {
      success: false,
      error: "Le prompt ou le code généré a été bloqué par nos filtres de sécurité universels (GCP Safety Gate). Veuillez reformuler votre demande de manière respectueuse et conforme.",
      status: 400
    };
  }
  
  const rawText = candidate?.content?.parts?.[0]?.text || '';
  
  const match = rawText.match(/```tsx([\s\S]*?)```/) || rawText.match(/```javascript([\s\S]*?)```/);
  const generatedCode = match ? match[1].trim() : rawText.trim();
  
  if (!generatedCode || generatedCode.length < 50) {
    return { success: false, error: 'AI generated empty or corrupted code', status: 500 };
  }

  return { success: true, code: generatedCode };
}
