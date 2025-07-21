const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// API endpoint for translations
app.get('/api/translations/:lang', (req, res) => {
  res.sendFile(path.join(__dirname, `../public/locales/${req.params.lang}.json`));
});

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));