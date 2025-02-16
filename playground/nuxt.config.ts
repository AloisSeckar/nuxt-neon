export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2024-02-02',
  neon: {
    sslMode: 'require',
    rawWarning: false,
  },
})
