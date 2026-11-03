import { isUrlReachable, isVideoReachable, isAudioReachable } from './urlReachability';
import { validateAndFixImages } from './imageResourceValidator';
import { validateAndFixBibliography } from './citationValidator';
import { findAlternativeAudioWithFallback } from './audioValidator';

export async function validateAndFixExternalResources(mdx: string, targetLang: string = 'fr'): Promise<string> {
  // 0. Do not strip media/image/hover-card tags before validation to preserve pedagogical components.
  let updatedMdx = mdx;

  // Validate and fix Video tags
  const videoRegex = /<Video\s+([^>]*?)\/>/gi;
  let videoMatch;
  const videoBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((videoMatch = videoRegex.exec(updatedMdx)) !== null) {
    videoBlocks.push({
      fullBlock: videoMatch[0],
      attributes: videoMatch[1]
    });
  }

  if (videoBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${videoBlocks.length} video elements...`);
    for (const block of videoBlocks) {
      const isValid = await isVideoReachable(block.fullBlock);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Video is dead: ${block.fullBlock}`);
        const titleMatch = block.attributes.match(/title="([^"]+)"/) || block.attributes.match(/title='([^']+)'/);
        const title = titleMatch ? titleMatch[1] : '';
        const durationMatch = block.attributes.match(/duration="([^"]+)"/) || block.attributes.match(/duration='([^']+)'/);
        const duration = durationMatch ? durationMatch[1] : '2:00';
        
        let alternativeFound = false;
        if (title) {
          const alternative = await findAlternativeVideoWithFallback(title, targetLang);
          if (alternative) {
            const newTag = `<Video id="${alternative.id || ''}" url="${alternative.url || ''}" provider="${alternative.provider || 'youtube'}" title="${title}" duration="${duration}" />`;
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            alternativeFound = true;
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead video with alternative: ${newTag}`);
          }
        }
        
        if (!alternativeFound) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] No alternative video found. Cleanly removing: ${block.fullBlock}`);
          updatedMdx = updatedMdx.replace(block.fullBlock, '');
        }
      }
    }
  }

  // Validate and fix Audio components
  const audioRegex = /<(?:Audio|AudioPlayer)\s+([^>]*?)\/>/gi;
  let audioMatch;
  const audioBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((audioMatch = audioRegex.exec(updatedMdx)) !== null) {
    audioBlocks.push({ fullBlock: audioMatch[0], attributes: audioMatch[1] });
  }

  if (audioBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${audioBlocks.length} audio elements...`);
    for (const block of audioBlocks) {
      const isValid = await isAudioReachable(block.fullBlock);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Audio is dead: ${block.fullBlock}`);
        const titleMatch = block.attributes.match(/title="([^"]+)"/) || block.attributes.match(/title='([^']+)'/);
        const title = titleMatch ? titleMatch[1] : '';
        const durationMatch = block.attributes.match(/duration="([^"]+)"/) || block.attributes.match(/duration='([^']+)'/);
        const duration = durationMatch ? durationMatch[1] : '1:00';
        
        let alternativeFound = false;
        if (title) {
          const altUrl = await findAlternativeAudioWithFallback(title, targetLang);
          if (altUrl) {
            const newTag = `<Audio url="${altUrl}" title="${title}" duration="${duration}" />`;
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            alternativeFound = true;
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead audio with alternative: ${newTag}`);
          }
        }
        
        if (!alternativeFound) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] No alternative audio found. Cleanly removing: ${block.fullBlock}`);
          updatedMdx = updatedMdx.replace(block.fullBlock, '');
        }
      }
    }
  }

  // Validate and fix Markdown links: [text](url)
  const linkRegex = /(?<!\!)\[([^\]]+)\]\(((?:https?:\/\/|\/\/)[^\s)]+)\)/gi;
  let linkMatch;
  const links: { fullMatch: string; text: string; url: string }[] = [];
  while ((linkMatch = linkRegex.exec(updatedMdx)) !== null) {
    if (linkMatch[0].includes('id="ref-') || linkMatch[0].includes('ref-')) {
      continue;
    }
    links.push({
      fullMatch: linkMatch[0],
      text: linkMatch[1],
      url: linkMatch[2]
    });
  }

  if (links.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${links.length} markdown links...`);
    for (const link of links) {
      const isValid = await isLinkReachable(link.url);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Link is dead: ${link.url}`);
        let resolvedUrl = '';
        const queries = [
          link.text,
          `${link.text} wikipedia`,
          `${link.text} official site`
        ];
        
        for (let attempt = 0; attempt < 3; attempt++) {
          const query = queries[attempt];
          const queryLang = (attempt === 2 && targetLang.toLowerCase() !== 'en') ? 'en' : targetLang.toLowerCase();
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Link retry ${attempt + 1}/3 with query: "${query}" in language "${queryLang}"`);
          
          try {
            const wikiRes = await fetchWithTimeout(`https://${queryLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
            if (wikiRes.ok) {
              const data = await wikiRes.json();
              if (data && data[3] && data[3][0]) {
                const wikiUrl = data[3][0];
                if (await isUrlReachable(wikiUrl)) {
                  resolvedUrl = wikiUrl;
                  break;
                }
              }
            }
          } catch (e) {
            console.warn(`[EXTERNAL RESOURCE VALIDATOR] Wiki search attempt failed:`, e);
          }
        }
        
        if (resolvedUrl) {
          const newLink = `[${link.text}](${resolvedUrl})`;
          updatedMdx = updatedMdx.replace(link.fullMatch, newLink);
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead link with Wikipedia alternative: ${newLink}`);
        } else {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Replacing dead link with plain text: ${link.url}`);
          updatedMdx = updatedMdx.replace(link.fullMatch, link.text);
        }
      }
    }
  }

  // Validate and fix GoingFurtherItem tags
  const goingFurtherRegex = /<GoingFurtherItem\b([^>]*?)(?:\/>|>([\s\S]*?)<\/GoingFurtherItem>)/gi;
  let goingFurtherMatch;
  const goingFurtherBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((goingFurtherMatch = goingFurtherRegex.exec(updatedMdx)) !== null) {
    goingFurtherBlocks.push({
      fullBlock: goingFurtherMatch[0],
      attributes: goingFurtherMatch[1]
    });
  }

  if (goingFurtherBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${goingFurtherBlocks.length} GoingFurtherItem elements...`);
    for (const block of goingFurtherBlocks) {
      const getAttr = (name: string) => {
        const curlyMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
        if (curlyMatch) return curlyMatch[1].trim();
        const quoteMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
        if (quoteMatch) return quoteMatch[2].trim();
        const unquotedMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*([^\\s/>]+)`, 'i'));
        if (unquotedMatch) return unquotedMatch[1].trim();
        return '';
      };

      const url = getAttr('url');
      const title = getAttr('title');
      const author = getAttr('author');
      const type = getAttr('type').toLowerCase() || 'website';

      if (url) {
        // 1. Check if the URL is obviously a placeholder/fake
        const lowerUrl = url.toLowerCase();
        const isPlaceholder = 
          lowerUrl.includes('example.com') || 
          lowerUrl.includes('your_youtube_id') || 
          lowerUrl.includes('youtube.com/watch?v=xxxxxx') ||
          lowerUrl.includes('youtube.com/watch?v=abcdef') ||
          lowerUrl.includes('youtube.com/watch?v=12345') ||
          lowerUrl.includes('test.com') ||
          lowerUrl.includes('placeholder') ||
          lowerUrl.includes('fakeurl');

        let isValid = !isPlaceholder;
        
        // 2. If it's a YouTube url, check via oembed/isVideoReachable
        if (isValid) {
          if (/youtube\.com|youtu\.be/i.test(url)) {
            const videoId = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i)?.[1] || '';
            if (!videoId || videoId === 'dQw4w9WgXcQ' || videoId === 'xxxxxxxxx') {
              isValid = false;
            } else {
              const checkUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
              isValid = await isUrlReachable(checkUrl);
            }
          } else {
            isValid = await isLinkReachable(url);
          }
        }

        if (!isValid) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] GoingFurtherItem has invalid/dead URL: ${url}`);
          let alternativeUrl = '';

          // 3. Try to find a real alternative if it is a video/film
          if ((type === 'video' || type === 'film' || type === 'movie') && title) {
            const alternative = await findAlternativeVideoWithFallback(title, targetLang);
            if (alternative && alternative.url) {
              alternativeUrl = alternative.url;
              console.log(`[EXTERNAL RESOURCE VALIDATOR] Found alternative video URL for "${title}": ${alternativeUrl}`);
            }
          }

          // 4. Fallback: try Wikipedia search for non-video types
          if (!alternativeUrl && title && type !== 'video' && type !== 'film' && type !== 'movie') {
            try {
              const query = (type === 'book' && author) ? `${title} ${author}` : title;
              const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
              if (wikiRes.ok) {
                const data = await wikiRes.json();
                if (data && data[3] && data[3][0] && await isUrlReachable(data[3][0])) {
                  alternativeUrl = data[3][0];
                }
              }
            } catch {}
          }

          // 5. Update the tag (replace URL if found, else strip it)
          let newTag = block.fullBlock;
          if (alternativeUrl) {
            newTag = block.fullBlock.replace(/url="[^"]*"/gi, `url="${alternativeUrl.replace(/"/g, '&quot;')}"`)
                                    .replace(/url='[^']*'/gi, `url="${alternativeUrl.replace(/"/g, '&quot;')}"`);
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
          } else {
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Removing GoingFurtherItem due to dead URL and resolution failure: ${title}`);
            updatedMdx = updatedMdx.replace(block.fullBlock, '');
          }
        }
      } else {
        // No URL in original — try to auto-resolve from title
        let resolvedUrl = '';
        if (title) {
          if (type === 'video' || type === 'film' || type === 'movie') {
            const alt = await findAlternativeVideoWithFallback(title, targetLang);
            if (alt && alt.url) resolvedUrl = alt.url;
          } else {
            for (const lang of [targetLang, 'en']) {
              try {
                const query = (type === 'book' && author) ? `${title} ${author}` : title;
                const wikiRes = await fetchWithTimeout(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
                if (wikiRes.ok) {
                  const data = await wikiRes.json();
                  if (data && data[3] && data[3][0] && await isUrlReachable(data[3][0])) {
                    resolvedUrl = data[3][0];
                    break;
                  }
                }
              } catch {}
              if (resolvedUrl) break;
            }
          }
          if (resolvedUrl) {
            const newTag = block.fullBlock.replace(/(\/?>)$/, ` url="${resolvedUrl.replace(/"/g, '&quot;')}" />`);
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Auto-resolved URL for "${title}": ${resolvedUrl}`);
          } else {
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Removing GoingFurtherItem due to no URL and resolution failure: ${title}`);
            updatedMdx = updatedMdx.replace(block.fullBlock, '');
          }
        }
      }
    }
  }

  // Clean up empty GoingFurther containers (possibly containing whitespace/newlines)
  updatedMdx = updatedMdx.replace(/<GoingFurther>\s*<\/GoingFurther>/gi, '');

  return updatedMdx;
}



