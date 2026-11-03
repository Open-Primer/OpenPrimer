import {
  WikiDetails,
  parseLocalGlossary,
  findGlossaryMatch,
  cleanWikipediaUrl,
  resolveWikiDetails,
  patchEntityAttrsIntoSource,
} from './wikipedia-helpers';

export {
  parseLocalGlossary,
  findGlossaryMatch,
  cleanWikipediaUrl,
  resolveWikiDetails,
  patchEntityAttrsIntoSource,
};
export type { WikiDetails };

export async function enrichEntityTagsWithWikipedia(content: string, lang: string, domain?: string): Promise<string> {

  // Parse the local glossary section first — provides a high-fidelity, zero-latency
  // fallback for terms that Wikipedia may not resolve (or that have spelling variations).
  const localGlossary = parseLocalGlossary(content);

  const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
  const tagRegex = new RegExp(`<(${entityTagsPattern})\\b([^>]*?)>([\\s\\S]*?)<\\/\\1>`, 'gi');

  let match;
  let lastIndex = 0;
  let enriched = '';

  const tagMatches: {
    fullMatch: string;
    tagName: string;
    attrsString: string;
    innerText: string;
    index: number;
  }[] = [];

  while ((match = tagRegex.exec(content)) !== null) {
    tagMatches.push({
      fullMatch: match[0],
      tagName: match[1],
      attrsString: match[2],
      innerText: match[3],
      index: match.index
    });
  }

  if (tagMatches.length === 0) {
    return content;
  }

  const parseAttr = (attrs: string, name: string): string | null => {
    const regex = new RegExp(`\\b${name}=\\s*(["'])(.*?)\\1`, 'i');
    const m = attrs.match(regex);
    return m ? m[2] : null;
  };

  // ── Pre-fetch all unique entity queries in parallel ──────────────────────
  // Build a deduplicated map of (queryName → resolvedType) so we can fire all
  // Wikipedia lookups concurrently instead of serially.
  const uniqueQueries = new Map<string, string>(); // queryName → resolvedType
  for (const item of tagMatches) {
    const nameVal = parseAttr(item.attrsString, 'name') || parseAttr(item.attrsString, 'term') || parseAttr(item.attrsString, 'word');
    const descVal = parseAttr(item.attrsString, 'description') || parseAttr(item.attrsString, 'definition');
    const urlVal  = parseAttr(item.attrsString, 'url') || parseAttr(item.attrsString, 'href') || parseAttr(item.attrsString, 'wikipediaUrl') || parseAttr(item.attrsString, 'wikipedia');
    const queryName = (nameVal || item.innerText || '').trim();
    if (!queryName) continue;
    // Skip if already flagged unresolved — validation already failed in repairMediaOnRestitution
    if (item.attrsString.includes('unresolved={true}') || item.attrsString.includes('unresolved="true"')) continue;
    // Skip if the tag already has both URL and description — no need to fetch
    if (urlVal && descVal) continue;
    if (uniqueQueries.has(queryName)) continue;

    const tagLower = item.tagName.toLowerCase();
    let resolvedType = 'entity';
    if (['realperson', 'historicalperson'].includes(tagLower)) resolvedType = 'person';
    else if (tagLower === 'fictionalcharacter') resolvedType = 'character';
    else if (tagLower === 'location') resolvedType = 'location';
    else if (tagLower === 'artwork') resolvedType = 'artwork';
    else if (['eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique'].includes(tagLower)) resolvedType = 'event';
    else if (['conceptlink', 'conceptlien', 'glossary'].includes(tagLower)) resolvedType = 'concept';
    else if (['theoremlink', 'theoremelien', 'théorèmelien'].includes(tagLower)) resolvedType = 'theorem';
    else if (['institutionlink', 'institutionlien'].includes(tagLower)) resolvedType = 'institution';
    else if (['specieslink', 'specieslien', 'especelien', 'espècelien', 'organismelien'].includes(tagLower)) resolvedType = 'species';
    else if (['chemicallink', 'chemicallien', 'moleculeslien', 'moleculelien', 'chimielien'].includes(tagLower)) resolvedType = 'chemical';
    else if (['celestiallink', 'celestiallien', 'corpsceleste', 'corpscéleste', 'astrolien'].includes(tagLower)) resolvedType = 'celestial';
    uniqueQueries.set(queryName, resolvedType);
  }

  // Fire all lookups concurrently
  const wikiDetailsMap = new Map<string, WikiDetails | null>();
  await Promise.all(
    Array.from(uniqueQueries.entries()).map(async ([queryName, resolvedType]) => {
      try {
        const details = await resolveWikiDetails(queryName, resolvedType, lang);
        wikiDetailsMap.set(queryName, details);
      } catch (err) {
        console.error(`[enrichEntityTagsWithWikipedia] Error resolving "${queryName}":`, err);
        wikiDetailsMap.set(queryName, null);
      }
    })
  );
  // ─────────────────────────────────────────────────────────────────────────

  for (const item of tagMatches) {
    enriched += content.substring(lastIndex, item.index);
    lastIndex = item.index + item.fullMatch.length;

    const nameVal = parseAttr(item.attrsString, 'name') || parseAttr(item.attrsString, 'term') || parseAttr(item.attrsString, 'word');
    const descVal = parseAttr(item.attrsString, 'description') || parseAttr(item.attrsString, 'definition');
    const urlVal = parseAttr(item.attrsString, 'url') || parseAttr(item.attrsString, 'href') || parseAttr(item.attrsString, 'wikipediaUrl') || parseAttr(item.attrsString, 'wikipedia');
    const datesVal = parseAttr(item.attrsString, 'dates') || parseAttr(item.attrsString, 'lifespan');

    const queryName = (nameVal || item.innerText || "").trim();

    if (item.attrsString.includes('unresolved={true}') || item.attrsString.includes('unresolved="true"')) {
      enriched += item.fullMatch;
      continue;
    }
    if (urlVal && descVal) {
      enriched += item.fullMatch;
      continue;
    }

    let resolvedType = 'entity';
    const tagLower = item.tagName.toLowerCase();
    if (['realperson', 'historicalperson'].includes(tagLower)) resolvedType = 'person';
    else if (tagLower === 'fictionalcharacter') resolvedType = 'character';
    else if (tagLower === 'location') resolvedType = 'location';
    else if (tagLower === 'artwork') resolvedType = 'artwork';
    else if (['eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique'].includes(tagLower)) resolvedType = 'event';
    else if (['conceptlink', 'conceptlien', 'glossary'].includes(tagLower)) resolvedType = 'concept';
    else if (['theoremlink', 'theoremelien', 'théorèmelien'].includes(tagLower)) resolvedType = 'theorem';
    else if (['institutionlink', 'institutionlien'].includes(tagLower)) resolvedType = 'institution';
    else if (['specieslink', 'specieslien', 'especelien', 'espècelien', 'organismelien'].includes(tagLower)) resolvedType = 'species';
    else if (['chemicallink', 'chemicallien', 'moleculeslien', 'moleculelien', 'chimielien'].includes(tagLower)) resolvedType = 'chemical';
    else if (['celestiallink', 'celestiallien', 'corpsceleste', 'corpscéleste', 'astrolien'].includes(tagLower)) resolvedType = 'celestial';

    if (queryName) {
      try {
        // Use pre-fetched result from the parallel fan-out above; fall back to
        // a direct call only for tags that were skipped (already fully enriched).
        const details = wikiDetailsMap.has(queryName)
          ? wikiDetailsMap.get(queryName)!
          : await resolveWikiDetails(queryName, resolvedType, lang);
        if (details) {
          let newAttrs = item.attrsString.trim();

          const finalUrl = urlVal || details.url;
          if (finalUrl) {
            if (tagLower === 'glossary') {
              newAttrs = newAttrs.replace(/\b(wikipediaUrl|wikipedia|url|href)=\s*(["'])(.*?)\2/gi, '').trim();
              newAttrs += ` wikipediaUrl="${finalUrl}"`;
            } else {
              newAttrs = newAttrs.replace(/\b(url|href|wikipediaUrl|wikipedia)=\s*(["'])(.*?)\2/gi, '').trim();
              newAttrs += ` url="${finalUrl}"`;
            }
          }

          const finalDesc = descVal || details.summary || details.description;
          if (finalDesc) {
            const escDesc = finalDesc.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
            if (tagLower === 'glossary') {
              newAttrs = newAttrs.replace(/\b(definition|description)=\s*(["'])(.*?)\2/gi, '').trim();
              newAttrs += ` definition="${escDesc}"`;
            } else {
              newAttrs = newAttrs.replace(/\bdescription=\s*(["'])(.*?)\1/gi, '').trim();
              newAttrs += ` description="${escDesc}"`;
            }
          }

          const finalDates = datesVal || details.dates;
          if (finalDates) {
            newAttrs = newAttrs.replace(/\b(dates|lifespan)=\s*(["'])(.*?)\2/gi, '').trim();
            newAttrs += ` dates="${finalDates}"`;
          }

          if (!parseAttr(item.attrsString, 'type')) {
            newAttrs += ` type="${resolvedType}"`;
          }

          if (!parseAttr(item.attrsString, 'name') && !parseAttr(item.attrsString, 'term') && !parseAttr(item.attrsString, 'word')) {
            if (tagLower === 'glossary') {
              newAttrs += ` term="${queryName.replace(/\"/g, '&quot;')}"`;
            } else {
              newAttrs += ` name="${queryName.replace(/\"/g, '&quot;')}"`;
            }
          }

          // Inject lesson domain/subject so the hovercard can display it in the header
          if (domain && !parseAttr(item.attrsString, 'domain') && !parseAttr(item.attrsString, 'subject')) {
            newAttrs += ` domain="${domain.replace(/"/g, '\\"')}"`;
          }

          const cleanAttrs = newAttrs.replace(/\s+/g, ' ').trim();
          enriched += `<${item.tagName} ${cleanAttrs}>${item.innerText}</${item.tagName}>`;
          continue;
        }

        // ── Local glossary fallback ──────────────────────────────────────────
        // Wikipedia returned nothing — try the pre-parsed local glossary with
        // fuzzy matching to handle typos like "vraissemblance" → "vraisemblance".
        if (localGlossary.size > 0) {
          const glossaryMatch = findGlossaryMatch(queryName, localGlossary);
          if (glossaryMatch) {
            let newAttrs = item.attrsString.trim();

            if (glossaryMatch.url) {
              if (tagLower === 'glossary') {
                newAttrs = newAttrs.replace(/\b(wikipediaUrl|wikipedia|url|href)=\s*(["'])(.*?)\2/gi, '').trim();
                newAttrs += ` wikipediaUrl="${glossaryMatch.url}"`;
              } else {
                newAttrs = newAttrs.replace(/\b(url|href|wikipediaUrl|wikipedia)=\s*(["'])(.*?)\2/gi, '').trim();
                newAttrs += ` url="${glossaryMatch.url}"`;
              }
            }

            if (!descVal) {
              const escDesc = glossaryMatch.definition.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
              if (tagLower === 'glossary') {
                newAttrs = newAttrs.replace(/\b(definition|description)=\s*(["'])(.*?)\2/gi, '').trim();
                newAttrs += ` definition="${escDesc}"`;
              } else {
                newAttrs = newAttrs.replace(/\bdescription=\s*(["'])(.*?)\1/gi, '').trim();
                newAttrs += ` description="${escDesc}"`;
              }
            }

            if (!parseAttr(item.attrsString, 'type')) newAttrs += ` type="${resolvedType}"`;
            if (!parseAttr(item.attrsString, 'name') && !parseAttr(item.attrsString, 'term') && !parseAttr(item.attrsString, 'word')) {
              newAttrs += tagLower === 'glossary'
                ? ` term="${queryName.replace(/"/g, '\\"')}"`
                : ` name="${queryName.replace(/"/g, '\\"')}"`;
            }
            if (domain && !parseAttr(item.attrsString, 'domain') && !parseAttr(item.attrsString, 'subject')) {
              newAttrs += ` domain="${domain.replace(/"/g, '\\"')}"`;
            }

            const cleanAttrs = newAttrs.replace(/\s+/g, ' ').trim();
            enriched += `<${item.tagName} ${cleanAttrs}>${item.innerText}</${item.tagName}>`;
            continue;
          }
        }
      } catch (err) {
        console.error(`[enrichEntityTagsWithWikipedia] Error resolving for "${queryName}":`, err);
      }
    }
    enriched += item.fullMatch;
  }

  enriched += content.substring(lastIndex);
  return enriched;
}

export async function resolvePrecompiledAnchors(
  content: string,
  lang: string
): Promise<{ resolvedContent: string; unresolvedAnchors: { raw: string; type: string; id: string; topic?: string }[] }> {
  const regex = /\[\[\s*WIDGET\s*:\s*([^:\s\]]+)\s*:\s*([^:\s\]]+)(?:\s*:\s*([^\]]+))?\s*\]\]+/gi;
  let match;
  const matches: { raw: string; type: string; id: string; topic?: string }[] = [];

  while ((match = regex.exec(content)) !== null) {
    const raw = match[0];
    const type = match[1].trim();
    const id = match[2].trim();
    const topic = match[3] ? match[3].trim() : '';
    matches.push({ raw, type, id, topic });
  }

  const resolverCapableTypes = new Set([
    'biography',
    'location',
    'glossary',
    'conceptlink',
    'conceptlien',
    'theoremlink',
    'theorem',
    'chemicallink',
    'chemical',
    'celestiallink',
    'celestial',
    'specieslink',
    'species',
    'institutionlink',
    'institution',
    'artwork',
    'fictionalcharacter',
    'character'
  ]);

  let resolvedContent = content;
  const unresolvedAnchors: typeof matches = [];

  for (const item of matches) {
    const typeLower = item.type.toLowerCase();

    if (typeLower === 'citation' || typeLower === 'reference' || typeLower === 'ref') {
      const num = item.id;
      const desc = item.topic || '';
      const titleAttr = desc ? ` title="${desc.replace(/"/g, "'")}"` : '';
      const tagStr = `<sup id="cite-${num}" class="scroll-mt-24"><a href="#ref-${num}"${titleAttr}>[${num}]</a></sup>`;
      resolvedContent = resolvedContent.replace(item.raw, tagStr);
      continue;
    }

    if (!resolverCapableTypes.has(typeLower)) {
      unresolvedAnchors.push(item);
      continue;
    }

    let queryName = item.topic || '';
    if (!queryName) {
      queryName = item.id.replace(/^(bio_|loc_|gloss_|concept_)/i, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    let resolvedType = 'concept';
    if (typeLower === 'biography' || typeLower === 'historicalperson') {
      resolvedType = 'person';
    } else if (typeLower === 'location') {
      resolvedType = 'location';
    } else if (typeLower === 'specieslink' || typeLower === 'species') {
      resolvedType = 'species';
    } else if (typeLower === 'chemicallink' || typeLower === 'chemical') {
      resolvedType = 'chemical';
    } else if (typeLower === 'celestiallink' || typeLower === 'celestial') {
      resolvedType = 'celestial';
    } else if (typeLower === 'institutionlink' || typeLower === 'institution') {
      resolvedType = 'institution';
    } else if (typeLower === 'artwork') {
      resolvedType = 'artwork';
    } else if (typeLower === 'fictionalcharacter' || typeLower === 'character') {
      resolvedType = 'character';
    }

    let cleanQuery = queryName;
    const parenIndex = queryName.indexOf('(');
    const commaIndex = queryName.indexOf(',');
    let endNameIndex = -1;
    if (parenIndex !== -1 && commaIndex !== -1) {
      endNameIndex = Math.min(parenIndex, commaIndex);
    } else if (parenIndex !== -1) {
      endNameIndex = parenIndex;
    } else if (commaIndex !== -1) {
      endNameIndex = commaIndex;
    }
    if (endNameIndex !== -1) {
      cleanQuery = queryName.substring(0, endNameIndex).trim();
    }

    try {
      const details = await resolveWikiDetails(cleanQuery, resolvedType, lang);
      if (details && (details.summary || details.description) && details.url) {
        let tagStr = '';
        const finalName = cleanQuery;
        const finalUrl = details.url;
        const finalDesc = details.summary || details.description || '';

        if (typeLower === 'biography') {
          const finalDates = details.dates || '';
          const datesAttr = finalDates ? ` dates="${finalDates.replace(/"/g, "'")}"` : '';
          tagStr = `<Biography name="${finalName.replace(/"/g, "'")}"${datesAttr} description="${finalDesc.replace(/"/g, "'")}" wikipediaUrl="${finalUrl.replace(/"/g, "'")}" />`;
        } else {
          let tagName = 'ConceptLink';
          if (typeLower === 'location') tagName = 'Location';
          else if (typeLower === 'historicalperson') tagName = 'HistoricalPerson';
          else if (typeLower === 'glossary') tagName = 'Glossary';
          else if (typeLower === 'theoremlink' || typeLower === 'theorem') tagName = 'TheoremLink';
          else if (typeLower === 'chemicallink' || typeLower === 'chemical') tagName = 'ChemicalLink';
          else if (typeLower === 'celestiallink' || typeLower === 'celestial') tagName = 'CelestialLink';
          else if (typeLower === 'specieslink' || typeLower === 'species') tagName = 'SpeciesLink';
          else if (typeLower === 'institutionlink' || typeLower === 'institution') tagName = 'InstitutionLink';
          else if (typeLower === 'artwork') tagName = 'Artwork';
          else if (typeLower === 'fictionalcharacter' || typeLower === 'character') tagName = 'FictionalCharacter';

          if (tagName === 'Glossary') {
            tagStr = `<Glossary term="${finalName.replace(/"/g, "'")}" definition="${finalDesc.replace(/"/g, "'")}" wikipediaUrl="${finalUrl.replace(/"/g, "'")}">${finalName}</Glossary>`;
          } else {
            const datesAttr = details.dates ? ` dates="${details.dates.replace(/"/g, "'")}"` : '';
            tagStr = `<${tagName} name="${finalName.replace(/"/g, "'")}"${datesAttr} description="${finalDesc.replace(/"/g, "'")}" url="${finalUrl.replace(/"/g, "'")}">${finalName}</${tagName}>`;
          }
        }

        resolvedContent = resolvedContent.replace(item.raw, tagStr);
        console.log(`[Wiki Pre-Compiler] Successfully resolved and compiled entity "${cleanQuery}" (${typeLower})`);
        continue;
      }
    } catch (err) {
      console.error(`[Wiki Pre-Compiler] Error resolving "${cleanQuery}":`, err);
    }

    unresolvedAnchors.push(item);
  }

  return { resolvedContent, unresolvedAnchors };
}


