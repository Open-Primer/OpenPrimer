const http = require('https');

const url = 'https://openprimer-worker-170696028139.europe-west9.run.app/api/tasks/dispatch?secret=OPSecretGate_280f1019';

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
