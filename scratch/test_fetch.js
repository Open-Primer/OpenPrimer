const http = require('http');

console.log('Sending request...');
const req = http.get('http://127.0.0.1:3000/L1/Biology/Biologie_Test/introduction', (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', res.headers);
  
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('BODY LENGTH:', body.length);
    console.log('BODY PREFIX:', body.slice(0, 100));
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('ERROR:', err);
  process.exit(1);
});
