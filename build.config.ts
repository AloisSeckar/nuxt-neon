import { defineBuildConfig } from 'unbuild'
import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

export default defineBuildConfig({
  // minify module.mjs
  rollup: {
    esbuild: {
      minify: true,
    },
  },
  hooks: {
    // minify entries in dist/runtime folder
    'mkdist:entry:options': (_ctx, _entry, options) => {
      options.esbuild = {
        ...options.esbuild,
        minify: true,
      }
    },
    // tsconfig.json is not relevant to be shipped
    'build:done': async (ctx) => {
      if (ctx.options.stub === false) {
        await rm(resolve('dist/runtime/server/tsconfig.json'), { force: true })
      }
    },
  },
})
