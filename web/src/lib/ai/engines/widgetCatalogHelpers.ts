import fs from 'fs';
import path from 'path';

export interface CitationStyleSpec {
  name: string;       // Short label, e.g. "APA 7"
  fullName: string;   // Full name, e.g. "American Psychological Association (APA), 7th edition"
  bookExample: string;
  articleExample: string;
  chapterExample: string;
  websiteExample: string;
  notes: string;
}

export function getCitationStyle(discipline: string): CitationStyleSpec {
  const d = (discipline || '').toLowerCase().trim();

  // ── Psychology, Behavioural Sciences, Social Sciences, Education, Linguistics
  if (/psycholog|psychiatr|cogniti|neuroscien|social scien|sociolog|anthropolog|politic|education|pedagog|linguist|communication|management|human resources|business administration/.test(d)) {
    return {
      name: 'APA 7',
      fullName: 'American Psychological Association (APA), 7th edition',
      bookExample: 'Lastname, A. B. (Year). *Book title: Subtitle*. Publisher. https://doi.org/xxxxx',
      articleExample: 'Lastname, A. B., & Lastname, C. D. (Year). Article title. *Journal Name*, *Volume*(Issue), page–page. https://doi.org/xxxxx',
      chapterExample: 'Lastname, A. B. (Year). Chapter title. In E. Editor (Ed.), *Book title* (pp. xx–xx). Publisher.',
      websiteExample: 'Author, A. (Year, Month Day). *Page title*. Website Name. https://www.example.com',
      notes: 'In-text citations use (Author, Year) format. Every in-text citation must have a matching reference entry. Use italics for journal names and book/report titles. Include DOI or URL when available.'
    };
  }

  // ── Humanities: Literature, History of Art, Film, Comparative Literature, Cultural Studies
  if (/literatur|humanities|film|cinema|cultur|art histor|comparative|theatre|music(?!olog)|media studi/.test(d)) {
    return {
      name: 'MLA 9',
      fullName: 'Modern Language Association (MLA), 9th edition',
      bookExample: 'Lastname, Firstname. *Book Title: Subtitle*. Publisher, Year.',
      articleExample: 'Lastname, Firstname. "Article Title." *Journal Name*, vol. X, no. Y, Year, pp. xx–xx. DOI or URL.',
      chapterExample: 'Lastname, Firstname. "Chapter Title." *Book Title*, edited by Firstname Lastname, Publisher, Year, pp. xx–xx.',
      websiteExample: 'Lastname, Firstname. "Page Title." *Website Name*, Day Month Year, URL.',
      notes: 'In-text citations use (Author page) parenthetical format. Container titles are italicised. Works Cited list is alphabetically sorted. Access dates required for online sources.'
    };
  }

  // ── History, Archaeology, Classical Studies, Philosophy (analytical)
  if (/histor(?!y of art)|archaeolog|classical|philosoph|ethics|politic(?!al scien)|theology|religion/.test(d)) {
    return {
      name: 'Chicago 17 (Notes–Bibliography)',
      fullName: 'Chicago Manual of Style, 17th edition — Notes–Bibliography system',
      bookExample: 'Lastname, Firstname. *Book Title: Subtitle*. City: Publisher, Year.',
      articleExample: 'Lastname, Firstname. "Article Title." *Journal Name* Volume, no. Issue (Year): page–page. https://doi.org/xxxxx.',
      chapterExample: 'Lastname, Firstname. "Chapter Title." In *Book Title*, edited by Firstname Lastname, xx–xx. City: Publisher, Year.',
      websiteExample: 'Lastname, Firstname. "Page Title." Website Name. Last modified Month Day, Year. URL.',
      notes: 'Use footnotes or endnotes for in-text citations (superscript numbers). Ibid. and short-form citations acceptable after first full note. Bibliography is alphabetical by author surname.'
    };
  }

  // ── Medicine, Biomedical Sciences, Nursing, Public Health, Pharmacology
  if (/medic(?!al law)|biomed|nursing|pharmac|public health|epidemiolog|clinical|health scien|surgery|radiol|patholog/.test(d)) {
    return {
      name: 'Vancouver / ICMJE',
      fullName: 'Vancouver style (International Committee of Medical Journal Editors — ICMJE recommendations)',
      bookExample: 'Lastname AB, Lastname CD. Book Title: Subtitle. Edition. City: Publisher; Year. Total pages p.',
      articleExample: 'Lastname AB, Lastname CD, Lastname EF. Article title. *Abbreviated J Name*. Year;Volume(Issue):page–page. doi:10.xxxx/xxxxx.',
      chapterExample: 'Lastname AB. Chapter title. In: Lastname EF, editor. Book Title. City: Publisher; Year. p. xx–xx.',
      websiteExample: 'Organisation Name [Internet]. Page title [cited Year Month Day]. Available from: https://www.example.com',
      notes: 'References are numbered sequentially in the order they appear in the text, using superscript numbers [1]. Journal titles are abbreviated per NLM/Index Medicus conventions. PMID or DOI must be included when available.'
    };
  }

  // ── Biology, Ecology, Zoology, Botany, Genetics, Molecular Biology, Biochemistry
  if (/biolog|ecolog|zoolog|botan|genetic|molecular|biochem|evolutionar|microbiolog/.test(d)) {
    return {
      name: 'CSE (Citation-Name)',
      fullName: 'Council of Science Editors (CSE), 8th edition — Citation-Name system',
      bookExample: 'Lastname AB, Lastname CD. Year. Book title: subtitle. City (State): Publisher. Total pages p.',
      articleExample: 'Lastname AB, Lastname CD. Year. Article title. *Journal Abbrev*. Volume(Issue):page–page. doi:10.xxxx/xxxxx.',
      chapterExample: 'Lastname AB. Year. Chapter title. In: Lastname EF, editor. Book title. City: Publisher. p. xx–xx.',
      websiteExample: '[Author/Organisation]. Year [accessed Year Month Day]. Page title. URL.',
      notes: 'References are listed alphabetically and numbered; in-text citations use the corresponding number in brackets [1]. Scientific names must be italicised. Abbreviate journal titles per NLM standard.'
    };
  }

  // ── Physical Sciences: Physics, Astronomy, Chemistry (general), Materials Science, Geoscience
  if (/physics|astronom|chemist(?!ry of law)|material scien|geoscien|geolog|earth scien|climat|atmospheri/.test(d)) {
    return {
      name: 'AIP / ACS',
      fullName: 'AIP Style (American Institute of Physics) for physics; ACS Style (American Chemical Society) for chemistry',
      bookExample: 'A. B. Lastname, *Book Title: Subtitle* (Publisher, City, Year), pp. xx–xx.',
      articleExample: 'A. B. Lastname and C. D. Lastname, J. Abbrev., **volume**, page (year). doi:10.xxxx/xxxxx.',
      chapterExample: 'A. B. Lastname, in *Book Title*, edited by C. D. Editor (Publisher, City, Year), pp. xx–xx.',
      websiteExample: 'A. B. Lastname, "Page title", Website Name (Year), URL, accessed Day Month Year.',
      notes: 'In-text citations are superscript numbers in the order of appearance. Journal names are abbreviated. Italicise journal abbreviation and volume number. DOI required for all journal articles.'
    };
  }

  // ── Mathematics, Statistics, Computer Science, Information Technology
  if (/mathematic|statistic|computer scien|information technolog|software|algorithm|cryptograph|data scien|artificial intelligence|machine learning/.test(d)) {
    return {
      name: 'ACM / IEEE',
      fullName: 'ACM Reference Format (computing) or IEEE Citation Style (engineering/CS)',
      bookExample: '[1] A. B. Lastname and C. D. Lastname, *Book Title: Subtitle*. City, Country: Publisher, Year, pp. xx–xx.',
      articleExample: '[1] A. B. Lastname, "Article title," *Journal Name*, vol. X, no. Y, pp. xx–xx, Month Year, doi: 10.xxxx/xxxxx.',
      chapterExample: '[1] A. B. Lastname, "Chapter title," in *Book Title*, C. D. Editor, Ed. City: Publisher, Year, pp. xx–xx.',
      websiteExample: '[1] A. B. Lastname. "Page title." Website Name. Accessed: Day Month Year. [Online]. Available: https://www.example.com',
      notes: 'References are numbered [1], [2], … in order of appearance in the text. Abbreviate journal and conference names per IEEE/ACM convention. All references in a numbered list at the end.'
    };
  }

  // ── Engineering: Civil, Mechanical, Electrical, Environmental
  if (/engineer|mechanic|electrical|civil|structural|environmental|aerospace|chemical engineer/.test(d)) {
    return {
      name: 'IEEE',
      fullName: 'IEEE Reference Style',
      bookExample: '[1] A. B. Lastname and C. D. Lastname, *Book Title*. City, Country: Publisher, Year, pp. xx–xx.',
      articleExample: '[1] A. B. Lastname, "Article title," *IEEE Trans. Abbrev.*, vol. X, no. Y, pp. xx–xx, Month Year, doi: 10.1109/xxx.',
      chapterExample: '[1] A. B. Lastname, "Chapter title," in *Book Title*, C. D. Editor, Ed. City: Publisher, Year, pp. xx–xx.',
      websiteExample: '[1] Organisation. "Page title." Accessed: Day Month Year. [Online]. Available: https://www.example.com',
      notes: 'In-text citations use bracketed sequential numbers [1]. Italicise book and journal titles. Abbreviate journal/conference names per the IEEE Abbreviations list.'
    };
  }

  // ── Economics, Finance, Business, Accounting, Marketing
  if (/econom|financ|accounting|marketing|business|commerce|management(?! de)/.test(d)) {
    return {
      name: 'APA 7',
      fullName: 'American Psychological Association (APA), 7th edition (standard in economics/business journals)',
      bookExample: 'Lastname, A. B. (Year). *Book title: Subtitle*. Publisher. https://doi.org/xxxxx',
      articleExample: 'Lastname, A. B., & Lastname, C. D. (Year). Article title. *Journal Name*, *Volume*(Issue), page–page. https://doi.org/xxxxx',
      chapterExample: 'Lastname, A. B. (Year). Chapter title. In E. Editor (Ed.), *Book title* (pp. xx–xx). Publisher.',
      websiteExample: 'Organisation Name. (Year, Month Day). *Report or page title*. Publisher/Website. https://www.example.com',
      notes: 'In-text citations use (Author, Year) or (Author, Year, p. xx) format. All references include DOI or URL. Working papers: include institution and working paper number.'
    };
  }

  // ── Law
  if (/\blaw\b|legal|jurisprudence|droit|rechtswissenschaft|derecho/.test(d)) {
    return {
      name: 'Oscillating (Bluebook / Dalloz / OSCOLA)',
      fullName: 'Legal citation: Bluebook (US/International), Dalloz style (France), or OSCOLA (UK) depending on jurisdiction',
      bookExample: 'LASTNAME Firstname, Title of Book, Publisher, City, Year, p. xx.',
      articleExample: 'LASTNAME Firstname, "Article title", Revue/Journal Name, Year, No. X, p. xx.',
      chapterExample: 'LASTNAME Firstname, "Chapter title", in EDITOR Firstname (dir.), Book Title, Publisher, Year, p. xx.',
      websiteExample: 'ORGANISATION, "Document title", Website Name, Date, [available at: URL, accessed Day Month Year].',
      notes: 'French law: author surnames in SMALL CAPS or all-caps; use « guillemets » for article titles; italicise journal and book titles. Cite legislation as: Code civil, art. XX. Cite case law by court, date, and publication reference. For other jurisdictions, follow the dominant national standard.'
    };
  }

  // ── Architecture, Design, Urban Planning, Fine Arts
  if (/architect|design|urban plan|fine art|visual art|graphic design/.test(d)) {
    return {
      name: 'Chicago 17 (Author–Date)',
      fullName: 'Chicago Manual of Style, 17th edition — Author–Date system (commonly used in architecture & design journals)',
      bookExample: 'Lastname, Firstname. Year. *Book Title: Subtitle*. City: Publisher.',
      articleExample: 'Lastname, Firstname. Year. "Article Title." *Journal Name* Volume (Issue): page–page. https://doi.org/xxxxx.',
      chapterExample: 'Lastname, Firstname. Year. "Chapter Title." In *Book Title*, edited by Firstname Lastname, xx–xx. City: Publisher.',
      websiteExample: 'Lastname, Firstname. Year. "Page Title." Website Name. Month Day. URL.',
      notes: 'In-text citations use (Author Year, page) format. Figures and images: full caption with artist, title, date, medium, and institution/collection. Licence and source URL required for reproduced images.'
    };
  }

  // ── Default fallback: general academic / multi-disciplinary
  return {
    name: 'Chicago 17 (Author–Date)',
    fullName: 'Chicago Manual of Style, 17th edition — Author–Date system (general academic fallback)',
    bookExample: 'Lastname, Firstname. Year. *Book Title: Subtitle*. City: Publisher.',
    articleExample: 'Lastname, Firstname. Year. "Article Title." *Journal Name* Volume (Issue): page–page. https://doi.org/xxxxx.',
    chapterExample: 'Lastname, Firstname. Year. "Chapter Title." In *Book Title*, edited by Firstname Lastname, xx–xx. City: Publisher.',
    websiteExample: 'Lastname, Firstname. Year. "Page Title." Website Name. Month Day. URL.',
    notes: 'In-text citations use (Author Year) or (Author Year, page) format. Full reference list at the end of the document, alphabetically by author.'
  };
}

export function getFilteredWidgetsCatalog(discipline: string): Record<string, any> {
  const dbCatalog = getDatabaseWidgets();
  if (!discipline) return dbCatalog;
  
  const filtered: Record<string, any> = {};
  const normDiscipline = discipline.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [id, meta] of Object.entries(dbCatalog)) {
    const disciplines: string[] = meta.disciplines || [];
    const hasAll = disciplines.some(d => d.toLowerCase() === 'all disciplines');
    if (hasAll) {
      filtered[id] = meta;
      continue;
    }
    
    const isMatch = disciplines.some(d => {
      const normD = d.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normDiscipline.includes(normD) || normD.includes(normDiscipline);
    });
    
    if (isMatch) {
      filtered[id] = meta;
    }
  }
  
  return filtered;
}

export function getDatabaseWidgets(): Record<string, any> {
  try {
    const catalogPath = path.join(process.cwd(), 'src', 'components', 'mdx', 'widgets_catalog.json');
    if (fs.existsSync(catalogPath)) {
      return JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    }
  } catch (err) {
    console.error('[AI] Error reading widgets_catalog.json:', err);
  }
  return {};
}
