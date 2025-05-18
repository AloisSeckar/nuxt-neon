export default defineNuxtConfig({
  modules: ['../src/module'],
  compatibilityDate: '2024-05-18',
  neon: {
    neonSSLMode: 'require',
    neonRawWarning: false,
  },
})
