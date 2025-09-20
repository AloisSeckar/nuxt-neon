import { loadVitestConfig } from 'nuxt-spec/config'

export default loadVitestConfig({
  test: {
    // run test files strictly one after another
    fileParallelism: false,
  },
})
