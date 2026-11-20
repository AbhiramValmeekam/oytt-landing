import { site } from '../config/site.mjs';
export function GET() {
  const routes = site.legalReady ? ['', '/support', '/privacy', '/terms', '/delete-account', '/children'] : ['', '/support'];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${site.origin}${route || '/'}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
}
