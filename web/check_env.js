const fs = require('fs');
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log("GEMINI_API_KEY exists in .env.local:", envContent.includes('GEMINI_API_KEY'));
  console.log("GOOGLE_API_KEY exists in .env.local:", envContent.includes('GOOGLE_API_KEY'));
} else {
  console.log(".env.local does not exist.");
}
