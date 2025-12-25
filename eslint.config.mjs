// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
    // Rules for formatting
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
    ],
  },
})
  .append([
    {
      rules: {
        // the default rule forces newline after "else"
        // I prefer using "} else {" on single row
        '@stylistic/brace-style': 'off',
      },
    },
  ])
