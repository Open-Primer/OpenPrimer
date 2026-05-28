const fs = require('fs');

const envContent = fs.readFileSync('c:\\Silvere\\Encours\\Developpement\\OpenPrimer\\web\\.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const resendKey = env.RESEND_API_KEY;
const geminiKey = env.GEMINI_API_KEY;

console.log("Supabase URL:", url);
console.log("Supabase Key:", key);
console.log("Resend Key:", resendKey);
console.log("Gemini Key:", geminiKey);

async function testSupabase() {
  const start = Date.now();
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key || '', Authorization: `Bearer ${key || ''}` },
      cache: 'no-store'
    });
    console.log("Supabase Status:", res.status, "Latency:", Date.now() - start, "ms");
  } catch (e) {
    console.error("Supabase Fail:", e.message);
  }
}

async function testResend() {
  const start = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${resendKey}` },
      cache: 'no-store'
    });
    console.log("Resend Status:", res.status, "Latency:", Date.now() - start, "ms");
    if (!res.ok) {
      const text = await res.text();
      console.log("Resend Error Body:", text);
    }
  } catch (e) {
    console.error("Resend Fail:", e.message);
  }
}

async function testGemini() {
  const start = Date.now();
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`, {
      cache: 'no-store'
    });
    console.log("Gemini Status:", res.status, "Latency:", Date.now() - start, "ms");
    if (!res.ok) {
      const text = await res.text();
      console.log("Gemini Error Body:", text);
    }
  } catch (e) {
    console.error("Gemini Fail:", e.message);
  }
}

async function testPollinations() {
  const start = Date.now();
  try {
    const res = await fetch('https://image.pollinations.ai', { method: 'HEAD', cache: 'no-store' });
    console.log("Pollinations Status:", res.status, "Latency:", Date.now() - start, "ms");
  } catch (e) {
    console.error("Pollinations Fail:", e.message);
  }
}

async function run() {
  await testSupabase();
  await testResend();
  await testGemini();
  await testPollinations();
}
run();
