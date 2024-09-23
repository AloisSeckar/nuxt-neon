import { defineNuxtModule, addImports, addPlugin, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition

export interface ModuleOptions {
  neonHost: string
  neonUser: string
  neonPass: string
  neonDB: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-neon',
    version: '0.1.0',
    configKey: 'neon',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    neonHost: '',
    neonUser: '',
    neonPass: '',
    neonDB: '',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.neonHost = options.neonHost
    nuxt.options.runtimeConfig.public.neonUser = options.neonUser
    nuxt.options.runtimeConfig.public.neonPass = options.neonPass
    nuxt.options.runtimeConfig.public.neonDB = options.neonDB

    addImports({
      name: 'useNeon',
      as: 'useNeon',
      from: resolver.resolve('runtime/composables/useNeon'),
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
