import { loadVitestConfig } from 'nuxt-spec/config'

export default loadVitestConfig({
  test: {
    // run test files strictly one after another
    fileParallelism: false,
    // because order of loading test files is not 100% guaranted,
    // enforicing "unit" test suite to run before "e2e" tests
    // was achieved via scripts in package.json
  },
}, false)
