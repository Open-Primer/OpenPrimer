/**
 * test_wikidata_resolver.ts
 *
 * Diagnostic runner to verify Wikidata resolution, biography/realperson validation,
 * and duplicate ID enforcement.
 */

import { resolvePersonDates, isPlaceholderDates } from '../src/lib/wikidata-resolver';
import { validateAndFixWidgets } from '../src/lib/ai';

async function runTests() {
  console.log('=== RUNNING WIKIDATA RESOLVER DIAGNOSTIC TESTS ===\n');

  // Test 1: isPlaceholderDates utility
  console.log('Test 1: isPlaceholderDates');
  const testCases = [
    { input: '1947–present', expected: false },
    { input: '1856–1939', expected: false },
    { input: 'N/A (personne vivante)', expected: true },
    { input: 'N/A', expected: true },
    { input: 'unknown', expected: true },
    { input: '1936-current', expected: true }, // "current" is suspect
    { input: '384-322 av. J.-C.', expected: false }
  ];

  for (const tc of testCases) {
    const got = isPlaceholderDates(tc.input);
    if (got === tc.expected) {
      console.log(` ✅ isPlaceholderDates("${tc.input}") = ${got}`);
    } else {
      console.error(` ❌ isPlaceholderDates("${tc.input}") = ${got}, expected ${tc.expected}`);
      process.exit(1);
    }
  }
  console.log('');

  // Test 2: Live resolvePersonDates on a historical figure (Newton)
  console.log('Test 2: resolvePersonDates (Isaac Newton)');
  const newtonResult = await resolvePersonDates('Isaac Newton', 'fr');
  if (newtonResult && (newtonResult.formatted === '1642–1727' || newtonResult.formatted === '1643–1727')) {
    console.log(` ✅ Correctly resolved Isaac Newton: ${newtonResult.formatted} (Wikidata: ${newtonResult.wikidataId})`);
  } else {
    console.error(` ❌ Failed to resolve Isaac Newton. Got:`, newtonResult);
    process.exit(1);
  }

  // Test 3: Live resolvePersonDates on a living figure (Hinton)
  console.log('Test 3: resolvePersonDates (Geoffrey Hinton)');
  const hintonResult = await resolvePersonDates('Geoffrey Hinton', 'en');
  if (hintonResult && hintonResult.formatted === '1947–present') {
    console.log(` ✅ Correctly resolved Geoffrey Hinton: ${hintonResult.formatted} (Wikidata: ${hintonResult.wikidataId})`);
  } else {
    console.error(` ❌ Failed to resolve Geoffrey Hinton. Got:`, hintonResult);
    process.exit(1);
  }
  console.log('');

  // Test 4: validateAndFixWidgets with duplicate IDs and dates placeholders
  console.log('Test 4: validateAndFixWidgets (Deduplication + Date Resolution)');
  const inputWidgets = {
    interactiveComponents: [
      {
        id: 'theoreme_bayes',
        componentType: 'RealPerson',
        sectionAnchor: '## Introduction',
        props: {
          name: 'Geoffrey Hinton',
          description: 'A pioneer in deep learning.',
          wikipediaUrl: 'https://en.wikipedia.org/wiki/Geoffrey_Hinton',
          searchQuery: 'Geoffrey Hinton',
          year: 'N/A (personne vivante)' // Should be resolved/cleaned
        }
      },
      {
        id: 'theoreme_bayes', // DUPLICATE ID
        componentType: 'RealPerson',
        sectionAnchor: '## Advanced',
        props: {
          name: 'Christopher Bishop',
          description: 'Author of Pattern Recognition and Machine Learning.',
          wikipediaUrl: 'https://en.wikipedia.org/wiki/Christopher_Bishop',
          searchQuery: 'Christopher Bishop',
          year: 'N/A (personne vivante)' // Should be resolved/cleaned
        }
      },
      {
        id: 'claudio_image',
        componentType: 'Image',
        sectionAnchor: '## Image Section',
        props: {
          title: 'Claudio Monteverdi portrait',
          searchQuery: 'Claudio Monteverdi',
          alt: 'Portrait of Claudio Monteverdi',
          description: 'A historical portrait painting of the composer Claudio Monteverdi.',
          caption: 'Original portrait of the Italian composer.',
          url: 'http://example.com/placeholder.jpg' // Should be resolved via Wikimedia Commons
        }
      }
    ],
    references: [
      "Attention Is All You Need Vaswani" // Should be resolved to formatted citation
    ]
  };

  const fixed = await validateAndFixWidgets(inputWidgets, 'Computer Science', 'en', false);
  console.log('Fixed widgets structure:', JSON.stringify(fixed, null, 2));

  // Assert deduplication
  const comp1 = fixed.interactiveComponents[0];
  const comp2 = fixed.interactiveComponents[1];

  if (comp1.id === 'theoreme_bayes' && comp2.id === 'theoreme_bayes_2') {
    console.log(' ✅ Successfully deduplicated interactiveComponent IDs ("theoreme_bayes" vs "theoreme_bayes_2")');
  } else {
    console.error(` ❌ Deduplication failed. IDs are: "${comp1.id}" and "${comp2.id}"`);
    process.exit(1);
  }

  // Assert date resolution
  if (comp1.props.year && comp1.props.year.includes('1947')) {
    console.log(` ✅ Successfully resolved Hinton's birth year: ${comp1.props.year}`);
  } else {
    console.error(` ❌ Date resolution failed for Hinton:`, comp1.props.year);
    process.exit(1);
  }

  if (comp2.props.year && comp2.props.year.includes('1959')) {
    console.log(` ✅ Successfully resolved Bishop's birth year: ${comp2.props.year}`);
  } else {
    console.error(` ❌ Date resolution failed for Bishop:`, comp2.props.year);
    process.exit(1);
  }

  // Assert Image component URL resolution
  const comp3 = fixed.interactiveComponents[2];
  if (comp3 && comp3.props.url && comp3.props.url.includes('wikimedia')) {
    console.log(` ✅ Successfully resolved Image URL to Wikimedia Commons: ${comp3.props.url}`);
  } else {
    console.error(` ❌ Image URL resolution failed. Got:`, comp3?.props?.url);
    process.exit(1);
  }

  // Assert Bibliography Reference resolution
  if (fixed.references && fixed.references[0] && fixed.references[0].includes('Vaswani') && fixed.references[0].includes('doi.org')) {
    console.log(` ✅ Successfully resolved bibliography reference: "${fixed.references[0]}"`);
  } else {
    console.error(` ❌ Bibliography reference resolution failed. Got:`, fixed.references);
    process.exit(1);
  }

  // Test 5: Event date resolution (French Revolution)
  console.log('Test 5: resolveEventDates (Révolution française)');
  const { resolveEventDates } = require('../src/lib/wikidata-resolver');
  const revolutionResult = await resolveEventDates('Révolution française', 'fr');
  if (revolutionResult && revolutionResult.formatted.includes('1789')) {
    console.log(` ✅ Correctly resolved French Revolution dates: ${revolutionResult.formatted} (Wikidata: ${revolutionResult.wikidataId})`);
  } else {
    console.error(` ❌ Failed to resolve French Revolution dates. Got:`, revolutionResult);
    process.exit(1);
  }

  // Test 6: Chemical formula resolution (Carbon dioxide)
  console.log('Test 6: resolveChemicalData (Carbon dioxide)');
  const { resolveChemicalData } = require('../src/lib/wikidata-resolver');
  const co2Result = await resolveChemicalData('Carbon dioxide', 'en');
  if (co2Result && co2Result.formula === 'CO₂') {
    console.log(` ✅ Correctly resolved Carbon dioxide formula: ${co2Result.formula} (Wikidata: ${co2Result.wikidataId})`);
  } else {
    console.error(` ❌ Failed to resolve Carbon dioxide formula. Got:`, co2Result);
    process.exit(1);
  }

  // Test 7: LaTeX formula resolution (Bayes' theorem)
  console.log("Test 7: resolveScientificFormula (Théorème de Bayes)");
  const { resolveScientificFormula } = require('../src/lib/wikidata-resolver');
  const bayesResult = await resolveScientificFormula("Théorème de Bayes", 'fr');
  if (bayesResult && bayesResult.formula && bayesResult.formula.includes('P(')) {
    console.log(` ✅ Correctly resolved Bayes' theorem LaTeX formula: ${bayesResult.formula} (Wikidata: ${bayesResult.wikidataId})`);
  } else {
    console.error(` ❌ Failed to resolve Bayes' theorem LaTeX formula. Got:`, bayesResult);
    process.exit(1);
  }

  // Test 8: Book resolution
  console.log("Test 8: resolveGoingFurtherResource (Book: Pattern Recognition and Machine Learning)");
  const { resolveGoingFurtherResource } = require('../src/lib/wikidata-resolver');
  const bookResult = await resolveGoingFurtherResource("Pattern Recognition and Machine Learning", "Christopher Bishop", "book", "en");
  if (bookResult && bookResult.url && (bookResult.url.startsWith('http://') || bookResult.url.startsWith('https://'))) {
    console.log(` ✅ Correctly resolved book: "${bookResult.title}" by ${bookResult.author} (${bookResult.year}) -> URL: ${bookResult.url}`);
  } else {
    console.error(` ❌ Failed to resolve book. Got:`, bookResult);
    process.exit(1);
  }

  // Test 9: Research article resolution
  console.log("Test 9: resolveGoingFurtherResource (Article: Attention Is All You Need)");
  const articleResult = await resolveGoingFurtherResource("Attention Is All You Need", "Vaswani", "article", "en");
  if (articleResult && articleResult.url && (articleResult.url.startsWith('http://') || articleResult.url.startsWith('https://'))) {
    console.log(` ✅ Correctly resolved research article: "${articleResult.title}" -> DOI: ${articleResult.url}`);
  } else {
    console.error(` ❌ Failed to resolve research article. Got:`, articleResult);
    process.exit(1);
  }

  console.log('\n=== ALL DIAGNOSTIC TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Fatal diagnostic test error:', err);
  process.exit(1);
});
