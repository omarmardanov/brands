import { defineConfig } from 'astro/config';

export default defineConfig({
  // GitHub Pages: сайт лежит в подпапке по имени репозитория
  site: 'https://omarmardanov.github.io',
  base: '/brands',

  // Каталожные страницы должны иметь слеш на конце и один канонический адрес
  trailingSlash: 'always',
  build: { format: 'directory' },
});
