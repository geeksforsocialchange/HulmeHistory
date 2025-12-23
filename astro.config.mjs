import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hulmehistory.org',
  output: 'static',
  devToolbar: {
    enabled: false
  },
  build: {
    assets: 'assets'
  },
  vite: {
    build: {
      assetsInlineLimit: 0
    }
  }
});
