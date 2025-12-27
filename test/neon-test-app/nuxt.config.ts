import MyModule from '../../src/module'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  /* @ts-expect-error Neon config CAN be passed like this but TS currently doesn't pick it up at this place */
  neon: {
    neonDB: 'elrh-neon',
    neonRawWarning: false,
    neonExposeEndpoints: true,
    neonExposeRawEndpoint: true,
    neonAllowedTables: 'playing_with_neon,playing_with_neon_2,playing_with_neon_3,neon2.playing_with_neon',
    neonAllowedQueries: 'SELECT id, name, value AS custom_value FROM playing_with_neon;SELECT id FROM playing_with_neon WHERE id = 5',
  },
})
