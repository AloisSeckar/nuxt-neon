import { defineConfig, type Plugin } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Nuxt Neon',
  description: 'Nuxt module allowing smooth integration with Neon database',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Overview', link: '/1-1-overview' },
      { text: 'Features', link: '/2-1-features' },
      { text: 'Changelog', link: '/3-1-changelog' },
      { text: 'Contributing', link: '/4-1-contributing' },
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Overview', link: '/1-1-overview' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Index', link: '/2-1-features' },
          { text: 'Server side', link: '/2-2-features-server' },
          { text: 'Client side', link: '/2-3-features-client' },
          { text: 'Shared features', link: '/2-4-features-shared' },
          { text: 'Module options', link: '/2-5-features-options' },
        ],
      },
      {
        text: 'Changelog',
        items: [
          { text: 'Changelog', link: '/3-1-changelog' },
        ],
      },
      {
        text: 'Contributing',
        items: [
          { text: 'Contributing guide', link: '/4-1-contributing' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AloisSeckar/nuxt-neon' },
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/AloisSeckar/nuxt-neon/blob/master/LICENSE">MIT License</a>',
      copyright: 'Copyright © 2024-present <a href="https://alois-seckar.cz/">Alois Sečkár</a>',
    },
  },

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          // in case custom icons are needed...
        },
      }) as Plugin,
    ],
  },
})
