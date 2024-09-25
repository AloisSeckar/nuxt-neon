import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders page with Neon demo', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    // check contents
    expect(html).toContain('<h1>Nuxt-Neon TEST</h1>')
    expect(html).toContain('"id"')
    expect(html).toContain('"name"')
    expect(html).toContain('"value"')
  })
})
