const puppeteer = require('puppeteer-core');
const { readdirSync } = require('fs');
const { join } = require('path');

const HTML_DIR = '/traproyalties-new/packages/frontend/public/cases';
const files = readdirSync(HTML_DIR).filter(f => f.endsWith('.html') && !f.startsWith('_'));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    headless: true,
  });

  let done = 0;
  for (const file of files) {
    const page = await browser.newPage();
    await page.goto('file://' + join(HTML_DIR, file), { waitUntil: 'networkidle0', timeout: 30000 });
    const pdfPath = join(HTML_DIR, file.replace('.html', '.pdf'));
    await page.pdf({ path: pdfPath, format: 'Letter', printBackground: true, margin: { top: '0', bottom: '0', left: '0', right: '0' } });
    await page.close();
    done++;
    console.log(done + '/' + files.length + ' ' + file);
  }

  await browser.close();
  console.log('Done — ' + done + ' PDFs generated');
})();
