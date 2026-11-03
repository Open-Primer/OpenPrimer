export function generateStatsMarkdown(stats: any): string {
  // Compute dollar cost
  const costUSD = (stats.tokenMetrics.promptTokens * 0.075 / 1_000_000) + (stats.tokenMetrics.candidatesTokens * 0.30 / 1_000_000);
  stats.estimatedCostUSD = Number(costUSD.toFixed(6));

  // Per-block breakdown lines
  let blockBreakdown = '';
  if (stats.narrativeBlockAttempts && Array.isArray(stats.narrativeBlockAttempts) && stats.narrativeBlockAttempts.length > 0) {
    blockBreakdown = '\n### Narrative Block Details\n';
    stats.narrativeBlockAttempts.forEach((b: any, i: number) => {
      const rejections = b.attempts - 1;
      blockBreakdown += `- **Block ${i + 1}** ("${b.sections?.join(' / ') || '?'}"): ${b.attempts} attempt${b.attempts > 1 ? 's' : ''}${rejections > 0 ? `, ${rejections} rejection${rejections > 1 ? 's' : ''}` : ''} → ${b.approved ? '✅ Approved' : '⚠️ Max iterations reached'}\n`;
    });
  }

  let widgetBlockBreakdown = '';
  if (stats.widgetBlockAttempts && Array.isArray(stats.widgetBlockAttempts) && stats.widgetBlockAttempts.length > 0) {
    widgetBlockBreakdown = '\n### Widget Block Details\n';
    stats.widgetBlockAttempts.forEach((b: any) => {
      widgetBlockBreakdown += `- **${b.blockName}**: ${b.attempts} attempt${b.attempts > 1 ? 's' : ''}${b.rejections > 0 ? `, ${b.rejections} rejection${b.rejections > 1 ? 's' : ''}` : ''} → ${b.approved ? '✅ Approved' : '⚠️ Max iterations reached'}\n`;
    });
  }

  return `# 📊 Generation Statistics: ${stats.lessonTitle}

- **Course Name**: ${stats.courseName}
- **Lesson Title**: ${stats.lessonTitle}
- **Lesson Slug**: ${stats.lessonSlug}
- **Academic Level**: ${stats.level}
- **Target Language**: ${stats.language.toUpperCase()}
- **Generation Date**: ${new Date(stats.startTime).toLocaleString()}
- **Status**: ${stats.status === 'success' ? '✅ SUCCESS' : '❌ FAILED'}
${stats.error ? `- **Error**: \`${stats.error}\`\n` : ''}

## ⏱️ Performance Metrics
- **Total Duration**: ${stats.durationSeconds} seconds
- **Syllabus Generation Attempts**: ${stats.syllabusAttempts}
- **Syllabus Critic Rejections**: ${stats.syllabusRejections ?? 0}
- **Narrative Blocks Total**: ${stats.narrativeBlockAttempts?.length ?? '?'}
- **Narrative Scribe Attempts (all blocks)**: ${stats.narrativeAttempts}
- **Narrative Critic Rejections (all blocks)**: ${stats.narrativeRejections}
- **Narrative Global Rewrites (4A)**: ${stats.narrativeGlobalRewrites ?? 0}
- **Narrative Localized Section Repairs (4A)**: ${stats.narrativeLocalRepairs ?? 0}
${blockBreakdown}
- **Widgets Architect Attempts**: ${stats.widgetsAttempts}
- **Widgets Critic Rejections**: ${stats.widgetsRejections}
- **MDX Self-Healing Attempts**: ${stats.selfHealingAttempts}
${widgetBlockBreakdown}

## 🪙 Token & Cost Estimation
- **Prompt Tokens**: ${stats.tokenMetrics.promptTokens.toLocaleString()}
- **Candidates Tokens**: ${stats.tokenMetrics.candidatesTokens.toLocaleString()}
- **Total Tokens**: ${(stats.tokenMetrics.promptTokens + stats.tokenMetrics.candidatesTokens).toLocaleString()}
- **Estimated Cost (Gemini 2.5 Flash)**: **$${costUSD.toFixed(6)}**
  *(Based on official pricing: $0.075/1M prompt tokens, $0.30/1M output tokens)*
`;
}

export function generateTranslationStatsMarkdown(stats: any): string {
  const costUSD = (stats.tokenMetrics.promptTokens * 0.075 / 1_000_000) + (stats.tokenMetrics.candidatesTokens * 0.30 / 1_000_000);
  stats.estimatedCostUSD = Number(costUSD.toFixed(6));

  return `# 📊 Translation Statistics: ${stats.lessonTitle}

- **Course Slug**: ${stats.courseSlug}
- **Lesson Title**: ${stats.lessonTitle}
- **Lesson Slug**: ${stats.lessonSlug}
- **Target Language**: ${stats.targetLanguage.toUpperCase()}
- **Translation Date**: ${new Date(stats.startTime).toLocaleString()}
- **Status**: ${stats.status === 'success' ? '✅ SUCCESS' : '❌ FAILED'}
${stats.error ? `- **Error**: \`${stats.error}\`\n` : ''}

## ⏱️ Performance Metrics
- **Total Duration**: ${stats.durationSeconds} seconds
- **Total MDX Sections**: ${stats.sectionsTotal}
- **Section Translation Failures**: ${stats.sectionTranslationFailures}
- **Translation Critic Iterations**: ${stats.critiqueIterations}
- **Translation Critic Rejections**: ${stats.critiqueRejections}
- **MDX Self-Healing Attempts**: ${stats.selfHealingAttempts}

## 🪙 Token & Cost Estimation
- **Prompt Tokens**: ${stats.tokenMetrics.promptTokens.toLocaleString()}
- **Candidates Tokens**: ${stats.tokenMetrics.candidatesTokens.toLocaleString()}
- **Total Tokens**: ${(stats.tokenMetrics.promptTokens + stats.tokenMetrics.candidatesTokens).toLocaleString()}
- **Estimated Cost (Gemini 2.5 Flash)**: **$${costUSD.toFixed(6)}**
  *(Based on official pricing: $0.075/1M prompt tokens, $0.30/1M output tokens)*
`;
}
