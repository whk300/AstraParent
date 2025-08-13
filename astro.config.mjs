import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://astraparent.com',
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date()
    })
  ],
  image: {
    formats: ['avif', 'webp'],
    domains: ['astraparent.com']
  },
  output: 'static'
});
