import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
export const baseURL = process.env.OYTT_BASE_URL || 'http://127.0.0.1:4321';
export const chromePath = process.env.OYTT_CHROME_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].find(path => existsSync(path));
export async function browser() {
  return chromium.launch({ ...(chromePath ? { executablePath: chromePath } : {}), headless: true });
}
