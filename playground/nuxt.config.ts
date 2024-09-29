export default defineNuxtConfig({
  compatibilityDate: '2024-09-23',
  modules: ['../src/module'],
  neon: {
    sslMode: 'require',
  },
  devtools: { enabled: true },
})
