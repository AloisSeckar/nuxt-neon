import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders Neon demo page and loads data from DB', async () => {
    // render in browser
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })
    // check contents
    const hasText = await page.getByText('Nuxt-Neon TEST').isVisible()
    expect(hasText).toBeTruthy()
    const dataDiv = page.locator('#data')
    expect(dataDiv).toBeDefined()
    const innerHTML = await dataDiv.innerHTML()
    expect(innerHTML).toContain('id')
    expect(innerHTML).toContain('name')
    expect(innerHTML).toContain('value')
  })
})
