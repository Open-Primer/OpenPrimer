import { chromium } from 'playwright';

async function testPage(url: string) {
  console.log(`\n========================================`);
  console.log(`Testing page: ${url}`);
  console.log(`========================================`);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning' || msg.text().includes('error') || msg.text().includes('failed')) {
      console.log(`[BROWSER ${type.toUpperCase()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    console.error(`[BROWSER CRASHED]`, exception);
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
    // Wait an additional 3 seconds to let client-side React hydration and Mermaid rendering complete
    await page.waitForTimeout(3000);
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('problème technique') || bodyText.includes('Error') || bodyText.includes('couldn\'t load') || bodyText.includes('technical error')) {
      console.log("  => Page contains error message!");
    } else {
      console.log("  => Page loaded successfully (no visible error text).");
    }
  } catch (err: any) {
    console.error("  => Navigation or load failed:", err.message);
  } finally {
    await browser.close();
  }
}

async function run() {
  const baseUrl = "http://localhost:3000";
  // Test some of the failing pages
  const urls = [
    `${baseUrl}/Beginner/Psychologie/introduction_à_la_psychologie/quest-ce-que-la-psychologie`,
    `${baseUrl}/Beginner/Psychologie/introduction_à_la_psychologie/methode-scientifique-psychologie`,
    `${baseUrl}/Beginner/Psychologie/introduction_à_la_psychologie/apprentissage-memoire`
  ];

  for (const url of urls) {
    await testPage(url);
  }
}

run().catch(console.error);
