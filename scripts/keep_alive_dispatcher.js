const http = require('https');

// SECURITY: the dispatch secret must never be hardcoded. Provide it via env (same value as server CRON_SECRET).
const CRON_SECRET = process.env.CRON_SECRET;
const WORKER_URL = process.env.WORKER_URL || 'https://openprimer-worker-170696028139.europe-west9.run.app';
if (!CRON_SECRET) {
  console.error('Missing CRON_SECRET environment variable. Aborting.');
  process.exit(1);
}
const url = `${WORKER_URL}/api/tasks/dispatch?secret=${encodeURIComponent(CRON_SECRET)}`;

function pulse() {
  console.log(`[${new Date().toISOString()}] Pulsing dispatch endpoint...`);
  const req = http.request(url, { method: 'POST' }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log(`[${new Date().toISOString()}] Dispatch response: ${data.trim()}`);
    });
  });
  req.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Dispatch pulse error:`, err.message);
  });
  req.end();
}

// Initial pulse
pulse();

// Pulse every 3 minutes (180,000 ms)
setInterval(pulse, 180000);
