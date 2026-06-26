const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const url = `${env['NEXT_PUBLIC_SUPABASE_URL']}/rest/v1/task_queue?select=*`;
const key = env['SUPABASE_SERVICE_ROLE_KEY'];

console.log("🔗 Fetching from:", url);

fetch(url, {
  headers: {
    'apikey': key,
    'Authorization': `Bearer ${key}`
  }
})
.then(res => {
  console.log("🟢 HTTP Status:", res.status);
  return res.json();
})
.then(data => {
  console.log("✅ Success! Total tasks found:", data.length);
})
.catch(err => {
  console.error("🔴 Fetch failed!");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  if (err.cause) {
    console.error("Cause message:", err.cause.message);
    console.error("Cause stack/code:", err.cause.code || err.cause.stack || err.cause);
  }
});
