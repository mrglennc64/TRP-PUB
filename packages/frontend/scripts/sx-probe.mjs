#!/usr/bin/env node
// Standalone SoundExchange probe — called by API route via child_process
// Args: --isrc ISRC  OR  --artist "Name" --title "Track"
// Outputs: JSON to stdout

import { chromium } from 'playwright-core';

const PROXIES = [
  '38.154.232.17:5030','38.154.187.65:6838','198.12.113.195:5516',
  '104.253.27.44:6469','45.39.8.139:6563','198.12.113.177:5498',
  '161.123.54.111:5495','104.252.45.55:6978','212.42.200.254:5657',
  '31.57.80.239:5622','45.39.16.181:7604','46.202.77.34:7777',
  '152.232.99.160:5171','104.252.171.212:7123','104.252.63.168:6090',
  '172.245.124.185:5574','198.12.113.11:5332','45.38.117.13:5924',
  '107.172.210.249:6704','154.17.163.185:5611','38.154.189.142:5915',
  '104.238.51.129:5515','212.42.200.253:5656','104.253.75.168:7590',
  '23.27.137.220:5595',
];
const PROXY_USER = 'bvsbathr';
const PROXY_PASS = '8stcxf7rcnqq';

// Parse CLI args
const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const isrc    = get('--isrc');
const artist  = get('--artist');
const title   = get('--title');

if (!isrc && !artist) {
  console.log(JSON.stringify({ error: 'isrc or artist required' }));
  process.exit(1);
}

const proxy = PROXIES[Math.floor(Math.random() * PROXIES.length)];
const [pHost, pPort] = proxy.split(':');

let url;
if (isrc) {
  url = `https://isrc.soundexchange.com/#!/isrc/${encodeURIComponent(isrc)}`;
} else {
  const artistClean = (artist || '').split(' ft.')[0].split(' ft ')[0].trim();
  const titleClean  = (title  || '').replace(/ \(Remix\)$/i, '').trim();
  const params = new URLSearchParams({ tab: 'simple', showReleases: 'true' });
  if (artistClean) params.set('artistName', artistClean);
  if (titleClean)  params.set('title', titleClean);
  url = `https://isrc.soundexchange.com/?${params}`;
}

let browser;
try {
  browser = await chromium.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    proxy: { server: `http://${pHost}:${pPort}`, username: PROXY_USER, password: PROXY_PASS },
  });

  const ctx  = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  });
  const page = await ctx.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Give Nuxt SPA time to render
  await page.waitForTimeout(3500);

  const data = await page.evaluate(() => {
    const text = document.body.innerText || '';

    // Result count
    const countMatch = text.match(/(\d[\d,]*)\s+result/i) || text.match(/Showing\s+(\d[\d,]*)/i);
    const resultCount = countMatch ? parseInt(countMatch[1].replace(/,/g, ''), 10) : null;

    // Table rows
    const rows = Array.from(document.querySelectorAll('tbody tr, .result-item, [class*="result"]'));
    const firstRow = rows[0] ? rows[0].innerText.trim() : null;

    // Registrant / label
    const labelEl = document.querySelector('[class*="label"], [class*="registrant"]');
    const registrant = labelEl ? labelEl.innerText.trim() : null;

    // ISRC code anywhere on page
    const isrcMatch = text.match(/\b([A-Z]{2}[A-Z0-9]{3}\d{7})\b/);

    // Performer assignment
    const notAssigned = /not\s+assigned/i.test(text);
    const assigned    = /\bassigned\b/i.test(text) && !notAssigned;

    return { text: text.slice(0, 4000), resultCount, firstRow, registrant, isrcMatch: isrcMatch ? isrcMatch[1] : null, notAssigned, assigned };
  });

  await browser.close();

  // Parse first row columns (SX table: Title | ISRC | Artist | Label | ...)
  let parsedTitle, parsedArtist, parsedRegistrant;
  if (data.firstRow) {
    const cols = data.firstRow.split(/\t|\n/).map(s => s.trim()).filter(Boolean);
    parsedTitle      = cols[0] || undefined;
    parsedArtist     = cols[1] || undefined;
    parsedRegistrant = data.registrant || cols[3] || undefined;
  }

  const result = {
    found: (data.resultCount ?? 0) > 0 || !!data.firstRow,
    registrant: parsedRegistrant || data.registrant || undefined,
    title: parsedTitle || title || undefined,
    artist: parsedArtist || artist || undefined,
    isrc: data.isrcMatch || isrc || undefined,
    resultCount: data.resultCount ?? undefined,
    performerAssigned: data.notAssigned ? false : data.assigned ? true : null,
    rawText: data.text.slice(0, 500),
    url,
    proxyUsed: `${pHost}:${pPort}`,
  };

  console.log(JSON.stringify(result));
  process.exit(0);

} catch (err) {
  if (browser) await browser.close().catch(() => {});
  console.log(JSON.stringify({ error: String(err), url }));
  process.exit(1);
}
