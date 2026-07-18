import { callVertexAI } from '../src/lib/vertex-client';
import fs from 'fs';
import path from 'path';

// Parse env variables manually from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    process.env[key] = value;
  }
}

async function test() {
  console.log("Testing Vertex AI...");
  console.log("GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
  console.log("VERTEX_PROJECT_ID:", process.env.VERTEX_PROJECT_ID);

  try {
    const response = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: 'Hello, this is a test. Answer with one word: "OK".' }] }],
      generationConfig: { temperature: 0.1 }
    });

    if (!response) {
      console.error("Test failed: No response object returned.");
      return;
    }

    console.log("Response status:", response.status, response.statusText);
    const text = await response.text();
    console.log("Response text:", text);
  } catch (err) {
    console.error("Test exception:", err);
  }
}

test();
