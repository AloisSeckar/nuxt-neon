// minify the dist files
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    esbuild: {
      minify: true,
    },
  },
  hooks: {
    'mkdist:entry:options': (_ctx, _entry, options) => {
      options.esbuild = {
        ...options.esbuild,
        minify: true,
      }
    },
  },
})
