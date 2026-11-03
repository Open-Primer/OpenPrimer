import { queryWikidataBirthDeath, queryWikidataEventDates, queryWikidataChemicalCompound, queryWikidataConceptFormula } from '../wikidata-resolver';

const FORMULA_SUFFIX_MAP: Record<string, string> = {
  FR: ' (formule)',
  EN: ' (formula)',
  ES: ' (fórmula)',
  DE: ' (Formel)',
  ZH: ' (公式)',
  PT: ' (fórmula)',
  AR: ' (صيغة)',
  HI: ' (सूत्र)',
  UR: ' (فارمولا)'
};

export async function healWikidataEntities(comp: any, targetLang: string): Promise<any> {
  const healed = { ...comp };
  const props = healed.props ? { ...healed.props } : {};
  const compType = healed.component || healed.type || '';

      // [FIX IC-2] Resolve dates for RealPerson / HistoricalPerson components via Wikidata.
      // The AI MUST NOT invent or hallucinate dates. We fetch them deterministically from
      // Wikidata (SPARQL) → Wikipedia extract. If not found, we leave dates empty (not a
      // placeholder string) so the critic cannot flag a spurious value.
      if (comp.componentType === "RealPerson" || comp.componentType === "HistoricalPerson") {
        const personName: string = (props.name || '').trim();
        const currentYear: string = (props.year || props.dates || '').trim();
        if (personName && isPlaceholderDates(currentYear)) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolvePersonDates(personName, targetLang);
            if (resolved && resolved.formatted) {
              // Prefer `year` if that is the field the schema uses, else `dates`
              if (props.year !== undefined) {
                props.year = resolved.formatted;
              }
              if (props.dates !== undefined || comp.componentType === 'HistoricalPerson') {
                props.dates = resolved.formatted;
              }
              console.log(`[PERSON DATE RESOLVER] Resolved dates for "${personName}": ${resolved.formatted} (Wikidata: ${resolved.wikidataId || 'N/A'})`);
            } else {
              // Cannot determine dates — remove placeholder to avoid critic rejection
              if (isPlaceholderDates(props.year)) delete props.year;
              if (isPlaceholderDates(props.dates)) delete props.dates;
              console.warn(`[PERSON DATE RESOLVER] No dates found for "${personName}" — placeholder removed.`);
            }
          } catch (err) {
            console.error(`[PERSON DATE RESOLVER] Error resolving dates for "${personName}":`, err);
            // Safety: remove known-bad placeholder on error
            if (isPlaceholderDates(props.year)) delete props.year;
            if (isPlaceholderDates(props.dates)) delete props.dates;
          }
        }
      }

      // [FIX IC-2b] Resolve dates for EventLink / HistoricalEventLink / EvenementHistorique / ÉvénementHistorique components via Wikidata.
      if (comp.componentType === "EventLink" || comp.componentType === "HistoricalEventLink" || comp.componentType === "EvenementHistorique" || comp.componentType === "ÉvénementHistorique") {
        const eventName: string = (props.name || '').trim();
        const currentYear: string = (props.year || props.dates || '').trim();
        if (eventName && isPlaceholderDates(currentYear)) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolveEventDates(eventName, targetLang);
            if (resolved && resolved.formatted) {
              if (props.year !== undefined) {
                props.year = resolved.formatted;
              }
              if (props.dates !== undefined) {
                props.dates = resolved.formatted;
              }
              if (props.year === undefined && props.dates === undefined) {
                props.dates = resolved.formatted;
              }
              console.log(`[EVENT DATE RESOLVER] Resolved dates for "${eventName}": ${resolved.formatted}`);
            } else {
              if (isPlaceholderDates(props.year)) delete props.year;
              if (isPlaceholderDates(props.dates)) delete props.dates;
            }
          } catch (err) {
            console.error(`[EVENT DATE RESOLVER] Error resolving dates for "${eventName}":`, err);
            if (isPlaceholderDates(props.year)) delete props.year;
            if (isPlaceholderDates(props.dates)) delete props.dates;
          }
        }
      }

      // [FIX IC-2c] Resolve chemical formula and SMILES for ConceptLink / Molecule / ChemicalLink components.
      if (comp.componentType === "ConceptLink" || comp.componentType === "Molecule" || comp.componentType === "ChemicalLink") {
        const entityName: string = (props.name || props.term || '').trim();
        if (entityName && entityName.length > 2) {
          const lowerName = entityName.toLowerCase();
          const isChemicalTerm = 
            lowerName.includes('acide') || lowerName.includes('acid') || lowerName.includes('dioxyde') || 
            lowerName.includes('dioxide') || lowerName.includes('sulfate') || lowerName.includes('hydroxyde') || 
            lowerName.includes('hydroxide') || lowerName.includes('chlorure') || lowerName.includes('chloride') || 
            lowerName.includes('eau') || lowerName.includes('water') || lowerName.includes('éthanol') || 
            lowerName.includes('ethanol') || lowerName.includes('méthane') || lowerName.includes('methane') ||
            lowerName.includes('benzène') || lowerName.includes('benzene') || lowerName.includes('glucose') ||
            comp.componentType === "Molecule" || comp.componentType === "ChemicalLink";

          if (isChemicalTerm) {
            try {
              const targetLang = (lang || 'en').toLowerCase().split('-')[0];
              const resolved = await resolveChemicalData(entityName, targetLang);
              if (resolved && resolved.formula) {
                props.formula = resolved.formula;
                if (resolved.smiles) props.smiles = resolved.smiles;
                
                if (props.description && !props.description.includes(resolved.formula)) {
                  const formulaSuffix = targetLang === 'fr' 
                    ? ` (formule chimique : ${resolved.formula})` 
                    : ` (chemical formula: ${resolved.formula})`;
                  props.description = props.description.trim() + formulaSuffix;
                }
                console.log(`[CHEMICAL RESOLVER] Resolved formula for "${entityName}": ${resolved.formula}`);
              }
            } catch (err) {
              console.error(`[CHEMICAL RESOLVER] Error for "${entityName}":`, err);
            }
          }
        }
      }

      // [FIX IC-2d] Resolve LaTeX formula for general scientific concepts.
      if (comp.componentType === "ConceptLink") {
        const conceptName: string = (props.name || props.term || '').trim();
        if (conceptName && !props.formula) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolveScientificFormula(conceptName, targetLang);
            if (resolved && resolved.formula) {
              props.formula = resolved.formula;
              console.log(`[FORMULA RESOLVER] Resolved LaTeX formula for "${conceptName}": ${resolved.formula}`);
            }
          } catch (err) {
            console.error(`[FORMULA RESOLVER] Error for "${conceptName}":`, err);
          }
        }
      }



      // Intelligent biography healing (description + dates)
      if (comp.componentType === "Biography") {
        let name = (props.name || "").trim();
        let description = (props.description || "").trim();
        const isPlaceholder = !description || description.length < 20 || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum|biographie détaillée/i.test(description) || /^[\[\(].*[\]\)]$/.test(description);

        // [FIX IC-3] Also resolve dates for Biography components via Wikidata
        if (name && isPlaceholderDates(props.dates)) {
          try {
            const targetLang = (lang || 'en').toLowerCase().split('-')[0];
            const resolved = await resolvePersonDates(name, targetLang);
            if (resolved && resolved.formatted) {
              props.dates = resolved.formatted;
              console.log(`[BIOGRAPHY DATE RESOLVER] Resolved dates for "${name}": ${resolved.formatted}`);
            } else {
              // Remove placeholder to keep critic happy
              if (isPlaceholderDates(props.dates)) delete props.dates;
            }
          } catch (err) {
            console.error(`[BIOGRAPHY DATE RESOLVER] Error for "${name}":`, err);
            if (isPlaceholderDates(props.dates)) delete props.dates;
          }
        }
        
        const isPlaceholderWiki = !props.wikipediaUrl || /placeholder|dummy|todo|tbd|tbc|lorem|ipsum/i.test(props.wikipediaUrl);
        if (name && (isPlaceholder || isPlaceholderWiki)) {
          console.log(`[BIOGRAPHY VALIDATOR] Biography placeholder description or missing/placeholder Wikipedia URL for "${name}". Resolving...`);
          try {
            const targetLang = (lang || 'fr').toLowerCase().split('-')[0];
            const wikiSearchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(name)}&srlimit=1`;
            const res = await fetchWithTimeout(wikiSearchUrl);
            if (res.ok) {
              const data = await res.json();
              const searchResult = data.query?.search?.[0];
              if (searchResult) {
                const canonicalTitle = searchResult.title;
                if (isPlaceholderWiki) {
                  props.wikipediaUrl = `https://${targetLang}.wikipedia.org/wiki/${encodeURIComponent(canonicalTitle.replace(/\s+/g, '_'))}`;
                }
                if (isPlaceholder) {
                  const wikiExtractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(canonicalTitle)}&redirects=1`;
                  const res2 = await fetchWithTimeout(wikiExtractUrl);
                  if (res2.ok) {
                    const data2 = await res2.json();
                    const pages = data2.query?.pages;
                    if (pages) {
                      const pageId = Object.keys(pages)[0];
                      if (pageId && pageId !== '-1') {
                        const extract = pages[pageId].extract || '';
                        if (extract && extract.length > 30) {
                          let sentence = extract.split(/[.!?]\s/)[0].trim();
                          const parts = extract.split(/[.!?]\s/);


  healed.props = props;
  return healed;
}
