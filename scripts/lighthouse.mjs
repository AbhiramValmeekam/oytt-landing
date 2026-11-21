import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { baseURL, chromePath } from './browser.mjs';

await mkdir('reports/lighthouse',{recursive:true});
const chrome = await launch({chromePath,chromeFlags:['--headless','--no-sandbox','--disable-dev-shm-usage']});
const summary = [];
try {
 for (const route of (process.env.OYTT_AUDIT_ROUTE ? [process.env.OYTT_AUDIT_ROUTE] : ['/', '/support', '/privacy'])) {
  for (const formFactor of ['mobile','desktop']) {
    const options = {port:chrome.port,output:['html','json'],logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']};
    const config = formFactor === 'desktop' ? {extends:'lighthouse:default',settings:{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:1000,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1}}} : undefined;
    const result = await lighthouse(`${baseURL}${route}`,options,config);
    const prefix = route === '/' ? '' : `${route.slice(1).replaceAll('/','-')}-`;
    await writeFile(`reports/lighthouse/${prefix}${formFactor}.html`,result.report[0]);
    await writeFile(`reports/lighthouse/${prefix}${formFactor}.json`,result.report[1]);
    summary.push({route,formFactor,...Object.fromEntries(Object.entries(result.lhr.categories).map(([key,value]) => [key,Math.round(value.score*100)])),metrics:{lcp:result.lhr.audits['largest-contentful-paint'].displayValue,cls:result.lhr.audits['cumulative-layout-shift'].displayValue},failedAudits:Object.values(result.lhr.audits).filter(audit => audit.score !== null && audit.score < 1).map(audit => ({id:audit.id,title:audit.title,score:audit.score,displayValue:audit.displayValue}))});
  }
 }
} finally { await chrome.kill(); }
await writeFile('reports/lighthouse/summary.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
if(summary.some(result => ['performance','accessibility','best-practices','seo'].some(key => result[key] < 95))) process.exitCode = 1;
