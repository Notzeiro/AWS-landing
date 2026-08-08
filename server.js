import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ADMIN // ACCESS DENIED</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body class="terminal-body">
      <div class="terminal-container">
        <p class="hacker-text error-text">> ACCESSING /ADMIN ROUTE...</p>
        <p class="hacker-text prompt-text">> Response: you really thought huh.</p>
        <a href="/" class="retro-btn">[ RETURN TO ROOT ]</a>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
