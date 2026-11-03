import fs from 'fs';
import path from 'path';
import { TransientNetworkError, StructuralJsonError } from '../../errors';

export { TransientNetworkError, StructuralJsonError };

export async function safeResponseJson(res: Response, contextName: string = 'unknown'): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new TransientNetworkError(`[HTTP NON-JSON RESPONSE] Expected JSON response, but received Content-Type "${contentType}" with status ${res.status}. Context: "${contextName}". Body: "${text.slice(0, 300)}"`);
  }
  try {
    return await res.json();
  } catch (e: any) {
    const text = await res.clone().text().catch(() => '');
    throw new StructuralJsonError(`[JSON PARSE ERROR] Failed to parse JSON response. Context: "${contextName}". Error: ${e.message}. Snippet: "${text.slice(0, 200)}"`);
  }
}

export function safeJsonParse(text: string, contextName: string = 'unknown'): any {
  if (!text || !text.trim()) {
    throw new StructuralJsonError(`[JSON PARSE FAILED] The model returned an empty response. Context: "${contextName}".`);
  }
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  if (cleaned.startsWith('<!DOCTYPE') || cleaned.startsWith('<html') || cleaned.startsWith('<')) {
    throw new TransientNetworkError(`[JSON PARSE FAILED] Received HTML response instead of JSON. Context: "${contextName}". Snippet: "${cleaned.slice(0, 200)}"`);
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        const potentialJson = cleaned.substring(startIdx, endIdx + 1);
        return JSON.parse(potentialJson);
      } catch (innerErr) {}
    }
    const startArr = cleaned.indexOf('[');
    const endArr = cleaned.lastIndexOf(']');
    if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
      try {
        const potentialJson = cleaned.substring(startArr, endArr + 1);
        return JSON.parse(potentialJson);
      } catch (innerErr) {}
    }
    
    console.error(`[safeJsonParse] JSON parse failure in context "${contextName}". Raw length: ${cleaned.length}`);
    console.error(`[safeJsonParse] Content snippet: "${cleaned.slice(0, 1000)}"`);
    
    throw new StructuralJsonError(`[JSON PARSE FAILED] The model returned an invalid JSON response (likely a natural language error or empty response). Context: "${contextName}". Error: ${(e as Error).message}. Snippet: "${cleaned.slice(0, 200)}"`);
  }
}

export function validateSchema(data: any, schema: any, path: string = ''): string[] {
  const errors: string[] = [];
  if (!schema) return errors;

  if (schema.type === 'object') {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push(`Field "${path}" should be an object.`);
      return errors;
    }
    if (schema.required) {
      for (const reqKey of schema.required) {
        if (!(reqKey in data) || data[reqKey] === undefined) {
          errors.push(`Field "${path ? `${path}.` : ''}${reqKey}" is required but missing.`);
        }
      }
    }
    if (schema.properties) {
      for (const key of Object.keys(data)) {
        if (schema.properties[key]) {
          errors.push(...validateSchema(data[key], schema.properties[key], `${path ? `${path}.` : ''}${key}`));
        }
      }
    }
  } else if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push(`Field "${path}" should be an array.`);
      return errors;
    }
    if (schema.items) {
      data.forEach((item, index) => {
        errors.push(...validateSchema(item, schema.items, `${path}[${index}]`));
      });
    }
  } else if (schema.type === 'string') {
    if (typeof data !== 'string') {
      errors.push(`Field "${path}" should be a string.`);
    }
  } else if (schema.type === 'integer' || schema.type === 'number') {
    if (typeof data !== 'number') {
      errors.push(`Field "${path}" should be a number.`);
    }
  } else if (schema.type === 'boolean') {
    if (typeof data !== 'boolean') {
      errors.push(`Field "${path}" should be a boolean.`);
    }
  }
  return errors;
}

export function saveDraftRevision(filename: string, content: string) {
  if (process.env.NODE_ENV === 'production' || process.env.DEBUG !== 'true') {
    return;
  }
  try {
    const targetDirs = [
      path.resolve(process.cwd(), 'drafts_revisions'),
      path.resolve(process.cwd(), 'web', 'drafts_revisions')
    ];
    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, filename), content, 'utf8');
    }

    console.log(`[DRAFTS_REVISIONS] Successfully saved ${filename} to drafts_revisions`);
  } catch (err) {
    console.error(`[DRAFTS_REVISIONS] Error saving ${filename}:`, err);
  }
}

export function getDescriptiveLevelForPrompt(level: string): string {
  if (!level) return 'Beginner Level';
  const clean = level.trim();
  switch (clean) {
    case 'L1':
      return 'University Year 1 / Bachelor 1st Year (L1)';
    case 'L2':
      return 'University Year 2 / Bachelor 2nd Year (L2)';
    case 'L3':
      return 'University Year 3 / Bachelor 3rd Year (L3)';
    case 'M1':
      return 'Master 1st Year (M1)';
    case 'M2':
      return 'Master 2nd Year (M2)';
    case 'foundation_1':
      return 'Primary School (foundation_1)';
    case 'foundation_2':
      return 'Primary School (foundation_2)';
    case 'secondary_1':
      return 'Middle School (secondary_1)';
    case 'secondary_2':
      return 'High School (secondary_2)';
    case 'preuni_1':
      return 'Pre-University Year 1 (preuni_1)';
    case 'preuni_2':
      return 'Pre-University Year 2 (preuni_2)';
    case 'preuni_3':
      return 'Pre-University Year 3 (preuni_3)';
    case 'beginner':
      return 'Beginner Level';
    case 'intermediate':
      return 'Intermediate Level';
    case 'advanced':
      return 'Advanced Level';
    case 'expert':
      return 'Expert Level';
    default:
      return clean;
  }
}

// Pedagogical level constraints and discipline guidelines extracted to ./ai/pedagogy-guidelines


// Pedagogical level constraints and discipline guidelines extracted to ../pedagogy-guidelines
export {
  type LevelConstraints,
  DEFAULT_LEVEL_CONSTRAINTS,
  loadLevelConstraintsFromDb,
  initializeConstraints,
  getConstraintKeyForLevel,
  getDisciplinePedagogicalGuidelines,
  getWordCountLimitForLevel
} from '../pedagogy-guidelines';


export async function mapConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const idx = nextIndex++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
