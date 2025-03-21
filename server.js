const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/html-to-image', async (req, res) => {
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: 'HTML is required' });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const image = await page.screenshot({ fullPage: true });

  await browser.close();

  res.set('Content-Type', 'image/png');
  res.send(image);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});