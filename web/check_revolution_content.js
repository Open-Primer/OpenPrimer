const http = require('http');

http.get('http://localhost:3000/secondary_2/General/revolution/introduction', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("Contains 'Révolutions'?", data.includes('Révolutions'));
    console.log("Contains 'Causes Structurelles'?", data.includes('Causes Structurelles'));
    console.log("Contains 'Introduction aux Révolutions'?", data.includes('Introduction aux Révolutions'));
    
    // Find h1 tag or titles
    const h1Match = data.match(/<h1[\s\S]*?>([\s\S]*?)<\/h1>/i);
    console.log("H1 text:", h1Match ? h1Match[1].replace(/<[^>]*>/g, '').trim() : "None");
  });
}).on('error', (err) => {
  console.error("HTTP GET Error:", err);
});
