export * from './ai/engines/coreUtils';
export * from './ai/engines/aiSchemas';
export * from './ai/engines/statsGenerators';
export * from './ai/engines/titleCorrection';
export * from './ai/engines/widgetCatalogHelpers';
export * from './ai/engines/sectionBasedTranslation';
export * from './ai/engines/courseTranslationEngine';
export * from './ai/engines/courseRevisionEngine';
export * from './ai/engines/mdxHealer';
export * from './ai/engines/curriculumGenerator';
export * from './ai/engines/mdxValidator';
export * from './ai/engines/deduplicationHelpers';
export * from './ai/engines/courseGenerationEngine';

// Re-export stitcher, healer, validator, schemas suites for 100% backward compatibility
export { stitchLessonContent, extractAndInjectCitations, replaceWidgetInMdx, removeWidgetFromMdx } from './ai/stitcher';
export { validateAndFixWidgets, resolveMissingFormulas } from './ai/widget-healer';
export { validateAndFixExternalResources, isUrlReachable, isVideoReachable, isAudioReachable, isLinkReachable } from './ai/resource-validator';
export { interactiveComponentSchema, lessonWidgetsSchema, curriculumSchema } from './ai/schemas';
