import { execSync } from 'child_process';

async function testModel(token: string, project: string, model: string) {
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${project}/locations/us-central1/publishers/google/models/${model}:generateContent`;
  console.log(`⏳ Querying Vertex AI for "${model}"...`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say hello in 3 words' }] }]
      })
    });

    if (res.ok) {
      console.log(`✅ Success for ${model}!`);
      const data = await res.json();
      console.log('Result:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    } else {
      const text = await res.text();
      console.error(`❌ Failed for ${model} (${res.status}):`, text.slice(0, 300));
    }
  } catch (err) {
    console.error(`❌ Exception for ${model}:`, err);
  }
}

async function main() {
  try {
    const token = execSync('gcloud auth print-access-token').toString().trim();
    const project = execSync('gcloud config get-value project').toString().trim();
    console.log(`🔑 Active project: "${project}"`);

    await testModel(token, project, 'gemini-2.5-flash');
    await testModel(token, project, 'gemini-2.0-flash-lite');
  } catch (err) {
    console.error('❌ Failed to run:', err);
  }
}

main();
