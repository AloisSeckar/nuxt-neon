import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // run test files strictly one after another
    fileParallelism: false,
  },
})
