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
      }
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

  console.log('\n=== ALL DIAGNOSTIC TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Fatal diagnostic test error:', err);
  process.exit(1);
});
