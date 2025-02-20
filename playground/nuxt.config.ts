export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2024-02-02',
  neon: {
    neonSSLMode: 'require',
    neonRawWarning: false,
  },
})
