import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://oytt-8435e.web.app',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  vite: { build: { assetsInlineLimit: 0 } },
});
