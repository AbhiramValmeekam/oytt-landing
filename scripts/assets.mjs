import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { browser, baseURL } from './browser.mjs';

await mkdir('public/assets', {recursive: true});
const mark = await readFile('public/favicon.svg');
for (const [file, size] of [['favicon-16.png',16], ['favicon-32.png',32], ['apple-touch-icon.png',180], ['icon-192.png',192], ['icon-512.png',512]]) {
  await sharp(mark).resize(size,size).png().toFile(`public/${file}`);
}
const instance = await browser();
try {
  const page = await instance.newPage({ viewport: {width:1200,height:630}, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
  await page.goto(baseURL, {waitUntil:'networkidle'});
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.evaluate(() => {
    const consoleMarkup = document.querySelector('.console').outerHTML;
    document.body.innerHTML = `<div class="og-card"><div class="og-copy"><div class="wordmark"><img src="/favicon.svg" width="32" height="32" alt=""> OYTT</div><h1>ON YOUR<br>TIME TOO<span>.</span></h1><p>Turn. Start. Log.</p><span class="mono og-label">TACTILE TIME TRACKING FOR ANDROID</span></div><div class="og-console">${consoleMarkup}</div></div>`;
    const style = document.createElement('style');
    style.textContent = `html,body{width:1200px;height:630px;overflow:hidden;background:#fff}.og-card{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:44px;padding:70px 64px;height:630px}.og-copy h1{font-size:92px;line-height:.96;margin-top:43px;letter-spacing:-.02em}.og-copy h1 span{color:#ff5500}.og-copy p{font-size:20px;margin-top:26px;color:#646464}.og-label{display:block;font-size:10px;letter-spacing:.05em;margin-top:28px;color:#646464}.og-console .console-time{font-size:38px}.og-console .dial{width:164px}.og-console .clock-cell{padding:34px 20px}.og-console .console{width:490px}.og-console .console-top{padding:22px 26px}`;
    document.head.append(style);
  });
  await page.screenshot({path:'public/og.png'});
  console.log('Generated favicon set and 1200×630 OG image from the live CSS console.');
} finally { await instance.close(); }
