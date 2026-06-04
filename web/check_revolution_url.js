const http = require('http');

http.get('http://localhost:3000/secondary_2/General/revolution/introduction', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log("HEADERS:", res.headers);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`BODY LENGTH: ${data.length}`);
    if (res.statusCode !== 200) {
      console.log(data.slice(0, 2000));
    } else {
      console.log("Page title / head match:");
      const titleMatch = data.match(/<title>([\s\S]*?)<\/title>/i);
      console.log("Title:", titleMatch ? titleMatch[1] : "None");
      console.log("Body preview:");
      console.log(data.slice(0, 1000));
    }
  });
}).on('error', (err) => {
  console.error("HTTP GET Error:", err);
});
