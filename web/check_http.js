const http = require('http');

http.get('http://localhost:3000/', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(`BODY LENGTH: ${data.length}`);
    console.log(data.slice(0, 1000));
  });
}).on('error', (err) => {
  console.error("HTTP GET Error:", err);
});
