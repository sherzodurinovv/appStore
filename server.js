const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Statik fayllarni xizmat qilish (HTML, CSS, rasmlar)
app.use(express.static(path.join(__dirname, 'public')));

// Ilovalar ma'lumotlarini olish uchun API
app.get('/api/apps', (req, res) => {
  const appsData = fs.readFileSync(path.join(__dirname, 'public', 'data', 'apps.json'));
  res.json(JSON.parse(appsData));
});

// Asosiy sahifani xizmat qilish
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} da ishlamoqda`);
});