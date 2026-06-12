import { chromium } from 'playwright';

async function run() {
  console.log("Launching headless browser to check page content...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  page.on('pageerror', exception => {
    console.error(`[BROWSER CRASHED]`, exception);
  });

  try {
    const targetUrl = "http://localhost:3000/Beginner/History/histoire_de_l'art/quest-ce-que-lart-et-lhistoire-de-lart";
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle' });
    console.log("Navigation finished. Waiting 2 seconds...");
    await page.waitForTimeout(2000);
    
    const bodyText = await page.innerText('body');
    console.log("================ BODY TEXT ================");
    console.log(bodyText);
    console.log("===========================================");
  } catch (err) {
    console.error("Navigation failed:", err);
  } finally {
    await browser.close();
  }
}

run();
