/**
 * OpenPrimer Media Resolver
 * Decoupled, modular media resolution suite (< 600 LOC per submodule)
 * Full 100% backward compatibility with all existing consumers.
 */

export * from './media/mediaTypes';
export { fetchWithTimeout, safeResponseJson, mediaValidationCache } from './media/storageHelpers';
export { searchYouTubeVideo } from './media/youtubeResolver';
export { isFactualMedia } from './media/factualMediaValidator';
export { optimizeQueryWithGemini, generateQueryRelaxationsWithGemini, searchCascade, describeImageWithGemini, generateGenericQueryWithGemini } from './media/conciseQueryBuilder';
export { compileFinalLabel, getSafeExtension, parseAttributesRobustly } from './media/figureFormatting';
export { fetchWikimediaAudio, synthesizeSpeech } from './media/wikimediaResolver';
export { validateImageWithGemini, validateImageSoftWithGemini } from './media/geminiImageValidator';
export { resolveMediaImage, resolveImageFromSources } from './media/imageSourceResolver';
export { resolveAndPersistMedia } from './media/mediaPipeline';
export { repairMediaOnRestitution } from './media/mediaRestitution';
