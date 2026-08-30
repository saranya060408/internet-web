import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static assets from root directory
app.use(express.static(__dirname));

// Direct ZIP download route
app.get('/sakthi-fiber-website.zip', (req, res) => {
  res.download(path.join(__dirname, 'sakthi-fiber-website.zip'), 'sakthi-fiber-website.zip');
});

// Single-page fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${PORT}`);
});
