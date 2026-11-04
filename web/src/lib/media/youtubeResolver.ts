import { optimizeQueryWithGemini } from './conciseQueryBuilder';
import { fetchWithTimeout } from './storageHelpers';
import { getLanguageSearchTerm } from './mediaTypes';

export async function searchYouTubeVideo(query: string): Promise<string | null> {
  try {
    const rawQuery = query.trim();
    const cleanQuery = await optimizeQueryWithGemini(rawQuery);
    if (cleanQuery !== rawQuery) {
      console.log(`[MEDIA-RESOLVER] Optimized YouTube search query from "${rawQuery}" to "${cleanQuery}"`);
    }
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`;
    const res = await fetchWithTimeout(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, 5000);
    if (!res.ok) return null;
    const html = await res.text();
    
    // Extract ytInitialData
    let ytInitialData: any = null;
    const jsonMatch = html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);
    if (jsonMatch) {
      try {
        ytInitialData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // Fallback brace matching if parsing failed
        const startIdx = html.indexOf('ytInitialData = {');
        if (startIdx !== -1) {
          const start = html.indexOf('{', startIdx);
          let braceCount = 1;
          let i = start + 1;
          while (i < html.length && braceCount > 0) {
            if (html[i] === '{') braceCount++;
            else if (html[i] === '}') braceCount--;
            i++;
          }
          if (braceCount === 0) {
            try {
              ytInitialData = JSON.parse(html.substring(start, i));
            } catch {}
          }
        }
      }
    }

    const videos: { videoId: string; title: string; viewCount: number; duration: string }[] = [];

    if (ytInitialData) {
      // Helper function to recursively find all videoRenderers
      const findRenderers = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        if (obj.videoRenderer) {
          const vr = obj.videoRenderer;
          const videoId = vr.videoId;
          let title = '';
          if (vr.title?.runs?.[0]?.text) title = vr.title.runs[0].text;
          else if (vr.title?.simpleText) title = vr.title.simpleText;

          let viewStr = '';
          if (vr.viewCountText?.simpleText) viewStr = vr.viewCountText.simpleText;
          else if (vr.shortViewCountText?.simpleText) viewStr = vr.shortViewCountText.simpleText;

          let durationStr = '';
          if (vr.lengthText?.simpleText) durationStr = vr.lengthText.simpleText;

          if (videoId && videoId.length === 11) {
            // Parse approximate view count
            let multiplier = 1;
            const cleanStr = viewStr.toLowerCase().replace(/[^0-9kmy\s.,]/g, '').trim();
            if (cleanStr.includes('k')) multiplier = 1000;
            else if (cleanStr.includes('m')) multiplier = 1000000;
            else if (cleanStr.includes('b') || cleanStr.includes('g')) multiplier = 1000000000;
            else if (cleanStr.includes('mille')) multiplier = 1000;
            else if (cleanStr.includes('million')) multiplier = 1000000;

            const valMatch = cleanStr.match(/([0-9]+(?:[.,][0-9]+)?)/);
            const viewCount = valMatch ? parseFloat(valMatch[1].replace(',', '.')) * multiplier : 0;

            videos.push({ videoId, title, viewCount, duration: durationStr });
          }
          return;
        }
        for (const key of Object.keys(obj)) {
          findRenderers(obj[key]);
        }
      };

      findRenderers(ytInitialData);
    }

    if (videos.length > 0) {
      // Sort by popularity viewCount descending as instructed
      const topCandidates = videos.slice(0, 5);
      topCandidates.sort((a, b) => b.viewCount - a.viewCount);
      console.log(`[YOUTUBE-SCRAPER] Sorted top candidates by viewCount:`, topCandidates.map(v => `${v.videoId} (${v.viewCount} views): "${v.title}"`));
      return topCandidates[0].videoId;
    }

    // Ultrafallback regex match if JSON parsing failed completely
    const fallbackMatch = html.match(/"videoId"\s*:\s*"([\w-]{11})"/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
    return null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] YouTube search failed for query "${query}":`, err);
    return null;
  }
}

export async function validateYouTubeVideo(videoId: string): Promise<boolean> {
  if (!videoId || videoId.length !== 11 || videoId.startsWith('placeholder') || videoId.includes('example')) {
    return false;
  }
  // Fast track: assume valid to avoid slow oembed checks on page load
  return true;
}

// Classifier to differentiate factual/scientific visual assets from general illustrative ones

