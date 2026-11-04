/**
 * OpenPrimer AI Stitcher
 * Modular stitcher pipeline (< 600 LOC per submodule)
 * 100% backward compatibility
 */

import { stitchInteractiveComponents } from './stitcher/interactiveComponentsStitcher';
import { stitchCompanionSections } from './stitcher/companionSectionsStitcher';

export * from './stitcher/citationManager';
export * from './stitcher/widgetLineFormatter';
export * from './stitcher/interactiveComponentsStitcher';
export * from './stitcher/companionSectionsStitcher';

export function stitchLessonContent(
  narrativeMdx: string,
  widgets: any,
  isTerminal: boolean = false,
  lang: string = 'fr'
): string {
  if (!widgets) return narrativeMdx;

  // 1. Stitch interactive components and anchor markers
  const { content } = stitchInteractiveComponents(narrativeMdx, widgets, isTerminal);

  // 2. Stitch companion sections (whatsNext, goingFurther, glossary, references, etc.)
  const finalContent = stitchCompanionSections(content, widgets, lang, isTerminal);

  return finalContent;
}

export function replaceWidgetInMdx(mdx: string, widgetName: string, newWidgetTag: string): string {
  const regex = new RegExp('<' + widgetName + '[^>]*\\/?>([\\s\\S]*?</' + widgetName + '>)?', 'g');
  return mdx.replace(regex, newWidgetTag);
}

export function removeWidgetFromMdx(mdx: string, widgetName: string): string {
  const regex = new RegExp('<' + widgetName + '[^>]*\\/?>([\\s\\S]*?</' + widgetName + '>)?', 'g');
  return mdx.replace(regex, '');
}
