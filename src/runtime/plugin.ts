import { defineNuxtPlugin, useNeon } from '#imports'

export default defineNuxtPlugin(async (/* nuxtApp */) => {
  console.debug('Testing provided connection to Neon database')
  const { isOk } = useNeon()
  console.debug(await isOk() ? 'Connection OK' : 'ERROR')
})
