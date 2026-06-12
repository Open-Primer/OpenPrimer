import { chromium } from 'playwright';

async function run() {
  console.log("Launching headless browser to debug client crash...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER ERROR] ${msg.text()}`);
    } else {
      console.log(`[BROWSER LOG] ${msg.text()}`);
    }
  });

  page.on('pageerror', exception => {
    console.error(`[BROWSER CRASHED]`, exception);
  });

  try {
    const targetUrl = "http://localhost:3000/Beginner/History/histoire_de_l'art/quest-ce-que-lart-et-lhistoire-de-lart";
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    console.log("Navigation finished. Waiting 5 seconds...");
    await page.waitForTimeout(5000);
  } catch (err) {
    console.error("Navigation failed:", err);
  } finally {
    await browser.close();
  }
}

run();
