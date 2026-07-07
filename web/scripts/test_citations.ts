import * as fs from 'fs';
import * as path from 'path';

// Load env variables
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let val = match[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

import { preprocessMdx, resolvePrecompiledAnchors } from '../src/lib/content';

async function run() {
  console.log('=== CITATION NORMALIZATION AND RESOLUTION TESTS ===\n');

  const testCases = [
    {
      name: 'Structured HTML citation with link',
      input: 'Voici une explication historique.<sup id="cite-2" class="scroll-mt-24"><a href="#ref-2">[2]</a></sup>',
      expectedWidget: 'Voici une explication historique.[[WIDGET:Citation:2]]',
      expectedHtml: 'Voici une explication historique.<sup id="cite-2" class="scroll-mt-24"><a href="#ref-2">[2]</a></sup>'
    },
    {
      name: 'HTML citation link without outer ID',
      input: 'Un autre fait.<sup><a href="#ref-3">[3]</a></sup>',
      expectedWidget: 'Un autre fait.[[WIDGET:Citation:3]]',
      expectedHtml: 'Un autre fait.<sup id="cite-3" class="scroll-mt-24"><a href="#ref-3">[3]</a></sup>'
    },
    {
      name: 'Raw superscript bracketed',
      input: 'Selon la source<sup>[4]</sup>',
      expectedWidget: 'Selon la source[[WIDGET:Citation:4]]',
      expectedHtml: 'Selon la source<sup id="cite-4" class="scroll-mt-24"><a href="#ref-4">[4]</a></sup>'
    },
    {
      name: 'Raw superscript numeric',
      input: 'Comme décrit ici<sup>5</sup>',
      expectedWidget: 'Comme décrit ici[[WIDGET:Citation:5]]',
      expectedHtml: 'Comme décrit ici<sup id="cite-5" class="scroll-mt-24"><a href="#ref-5">[5]</a></sup>'
    },
    {
      name: 'Simple markdown link citation',
      input: 'Voir la référence [6](#ref-6)',
      expectedWidget: 'Voir la référence [[WIDGET:Citation:6]]',
      expectedHtml: 'Voir la référence <sup id="cite-6" class="scroll-mt-24"><a href="#ref-6">[6]</a></sup>'
    },
    {
      name: 'Manual bracketed ref syntax',
      input: 'Une étude récente [ref-7] montre cela.',
      expectedWidget: 'Une étude récente [[WIDGET:Citation:7]] montre cela.',
      expectedHtml: 'Une étude récente <sup id="cite-7" class="scroll-mt-24"><a href="#ref-7">[7]</a></sup> montre cela.'
    },
    {
      name: 'Typo widget syntax with single brackets',
      input: 'Un autre document [WIDGET: reference: 8] prouve ce point.',
      expectedWidget: 'Un autre document [[WIDGET:Citation:8]] prouve ce point.',
      expectedHtml: 'Un autre document <sup id="cite-8" class="scroll-mt-24"><a href="#ref-8">[8]</a></sup> prouve ce point.'
    },
    {
      name: 'Typo widget syntax with double brackets and space',
      input: 'Et aussi [[WIDGET: referecne: 9]].',
      expectedWidget: 'Et aussi [[WIDGET:Citation:9]].',
      expectedHtml: 'Et aussi <sup id="cite-9" class="scroll-mt-24"><a href="#ref-9">[9]</a></sup>.'
    }
  ];

  let allPassed = true;

  for (const tc of testCases) {
    console.log(`Testing Case: "${tc.name}"`);
    
    // 1. Test preprocessMdx sanitization
    const preprocessed = preprocessMdx(tc.input, 'fr').trim();
    if (preprocessed !== tc.expectedWidget) {
      console.error(`❌ Preprocess failed!\n   Input:    ${tc.input}\n   Expected: ${tc.expectedWidget}\n   Got:      ${preprocessed}`);
      allPassed = false;
    } else {
      console.log(`   ✅ Preprocessed correctly to: ${preprocessed}`);
    }

    // 2. Test resolvePrecompiledAnchors resolution
    const { resolvedContent } = await resolvePrecompiledAnchors(preprocessed, 'fr');
    const resolvedTrimmed = resolvedContent.trim();
    if (resolvedTrimmed !== tc.expectedHtml) {
      console.error(`❌ Anchor resolution failed!\n   Input:    ${preprocessed}\n   Expected: ${tc.expectedHtml}\n   Got:      ${resolvedTrimmed}`);
      allPassed = false;
    } else {
      console.log(`   ✅ Resolved correctly to:     ${resolvedTrimmed}`);
    }
    console.log();
  }

  // 3. Test validateMdxContent simulation regex
  console.log('Testing validateMdxContent simulation regex:');
  const legacyCitationRegex = /<\/?sup\b|\[ref[-_]?\d+\]/gi;
  
  const rawLegacy = "Un texte avec <sup id='cite-1'>[1]</sup> et [ref-2].";
  const processedClean = preprocessMdx(rawLegacy, 'fr');
  
  console.log(`   Raw content:       "${rawLegacy}"`);
  console.log(`   Preprocessed:      "${processedClean.trim()}"`);
  
  const rawHasLegacy = legacyCitationRegex.test(rawLegacy);
  const processedHasLegacy = legacyCitationRegex.test(processedClean);
  
  if (rawHasLegacy && !processedHasLegacy) {
    console.log("   ✅ Legacy detection passed: Raw content rejected, preprocessed content accepted.");
  } else {
    console.error(`   ❌ Legacy detection failed! rawHasLegacy: ${rawHasLegacy}, processedHasLegacy: ${processedHasLegacy}`);
    allPassed = false;
  }

  if (allPassed) {
    console.log('\n🎉 ALL CITATION TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } else {
    console.log('\n❌ SOME CITATION TESTS FAILED.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
