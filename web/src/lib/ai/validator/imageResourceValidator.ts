import { isUrlReachable } from './urlReachability';

export async function validateAndFixImages(mdx: string): Promise<string> {
  const figureRegex = /!\[(.*?)\]\(((?:https?:\/\/|\/\/).*?)\)\s*\r?\n\s*\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013].*?)\s*\*(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  
  let match;
  const blocks: { fullBlock: string; url: string }[] = [];
  
  while ((match = figureRegex.exec(mdx)) !== null) {
    blocks.push({
      fullBlock: match[0],
      url: match[2]
    });
  }
  
  if (blocks.length === 0) {
    return mdx;
  }
  
  console.log(`[IMAGE VALIDATOR] Found ${blocks.length} images to validate.`);
  
  const validationResults = await Promise.all(
    blocks.map(async (block) => {
      const urlLower = block.url.toLowerCase();
      if (
        urlLower.includes('example.com') ||
        urlLower.includes('placeholder') ||
        urlLower.includes('tbd') ||
        urlLower.includes('dummy') ||
        urlLower.includes('your_') ||
        block.url.trim() === ''
      ) {
        console.warn(`[IMAGE VALIDATOR] Deleting image block with placeholder URL: ${block.url}`);
        return { fullBlock: block.fullBlock, isValid: false };
      }

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(block.url, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(id);
        if (!response.ok) {
          console.warn(`[IMAGE VALIDATOR] Image failed with status ${response.status}: ${block.url}`);
          if (block.url.includes('pollinations.ai')) {
            return { fullBlock: block.fullBlock, isValid: true };
          }
          return { fullBlock: block.fullBlock, isValid: false };
        }
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          console.warn(`[IMAGE VALIDATOR] Image URL returned a JSON error payload: ${block.url}`);
          if (block.url.includes('pollinations.ai')) {
            return { fullBlock: block.fullBlock, isValid: true };
          }
          return { fullBlock: block.fullBlock, isValid: false };
        }
        console.log(`[IMAGE VALIDATOR] Image validated successfully: ${block.url}`);
        return { fullBlock: block.fullBlock, isValid: true };
      } catch (err: any) {
        clearTimeout(id);
        console.warn(`[IMAGE VALIDATOR] Error checking image ${block.url}:`, err);
        if (block.url.includes('pollinations.ai') || err.name === 'AbortError') {
          console.log(`[IMAGE VALIDATOR] Keeping pollinations/timeout image: ${block.url}`);
          return { fullBlock: block.fullBlock, isValid: true };
        }
        return { fullBlock: block.fullBlock, isValid: false };
      }
    })
  );
  
  let updatedMdx = mdx;
  for (const res of validationResults) {
    if (!res.isValid) {
      console.log(`[IMAGE VALIDATOR] Removing failed image block.`);
      updatedMdx = updatedMdx.replace(res.fullBlock, '');
    }
  }
  
  return updatedMdx;
}


