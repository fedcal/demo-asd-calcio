import { defineConfig } from 'vitepress';

const SLUG = 'asd-calcio';
const TITLE = 'Demo ASD Calcio Giovanile — Federico Calò';

export default defineConfig({
  title: TITLE,
  description: 'Documentazione tecnica del template Angular 21 SSR per ASD Calcio Giovanile.',
  base: `/demo-${SLUG}/`,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lang: 'it-IT',

  themeConfig: {
    siteTitle: 'Demo ASD Calcio Giovanile',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Architettura', link: '/architecture' },
      { text: 'Mock Data', link: '/mock-data' },
      { text: 'Customization', link: '/customization' },
      { text: 'Deployment', link: '/deployment' },
      { text: 'Demo live ↗', link: `https://${SLUG}.demo.federicocalo.dev` }
    ],

    sidebar: [
      {
        text: 'Guida',
        items: [
          { text: 'Introduzione', link: '/' },
          { text: 'Architettura', link: '/architecture' },
          { text: 'Mock data', link: '/mock-data' },
          { text: 'Customization', link: '/customization' },
          { text: 'Deployment', link: '/deployment' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: `https://github.com/fedcal/demo-${SLUG}` }
    ],

    footer: {
      message: 'Demo di <a href="https://federicocalo.dev">Federico Calò</a> — MIT License',
      copyright: `© ${new Date().getFullYear()} Federico Calò`
    },

    search: {
      provider: 'local'
    }
  }
});
