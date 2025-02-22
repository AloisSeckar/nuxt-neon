import { fileURLToPath } from 'node:url'
import { describe, test, expect } from 'vitest'
import { setup, createPage, url } from '@nuxt/test-utils/e2e'

describe('nuxt-neon basic test suite', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  test('Neon demo app loaded and DB connected', async () => {
    // render in browser
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })

    // title was rendered
    const hasText = await page.getByText('Nuxt-Neon TEST').isVisible()
    expect(hasText).toBeTruthy()

    // connection status is ok ("true")
    const statusDiv = page.locator('#status')
    expect(statusDiv).toBeDefined()
    const innerHTML = await statusDiv.innerHTML()
    expect(innerHTML).toContain('true')
  })

  test('All test components are rendered', async () => {
    // render in browser
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })

    // TestRaw component mounted
    const rawTitle = page.locator('#raw')
    expect(rawTitle).toBeDefined()
    const rawHtml = await rawTitle.innerHTML()
    expect(rawHtml).toContain('Raw SQL Queries')
    const rawButton = page.locator('#raw-button')
    expect(rawButton).toBeDefined()

    // TestSelect component mounted
    const selectTitle = page.locator('#select')
    expect(selectTitle).toBeDefined()
    const selectHtml = await selectTitle.innerHTML()
    expect(selectHtml).toContain('SELECT')
    const selectButton = page.locator('#select-button')
    expect(selectButton).toBeDefined()

    // TestInsert component mounted
    const insertTitle = page.locator('#insert')
    expect(insertTitle).toBeDefined()
    const insertHtml = await insertTitle.innerHTML()
    expect(insertHtml).toContain('INSERT')
    const insertButton = page.locator('#insert-button')
    expect(insertButton).toBeDefined()

    // TestUpdate component mounted
    const updateTitle = page.locator('#update')
    expect(updateTitle).toBeDefined()
    const updateHtml = await updateTitle.innerHTML()
    expect(updateHtml).toContain('UPDATE')
    const updateButton = page.locator('#update-button')
    expect(updateButton).toBeDefined()

    // TestDelete component mounted
    const deleteTitle = page.locator('#delete')
    expect(deleteTitle).toBeDefined()
    const deleteHtml = await deleteTitle.innerHTML()
    expect(deleteHtml).toContain('DELETE')
    const deleteButton = page.locator('#delete-button')
    expect(deleteButton).toBeDefined()
  })

  test('Basic DATA FETCHING test', async () => {
    // render in browser
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })

    // check contents
    await page.click('#raw-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/raw') && response.ok(),
    )
    const dataDiv = page.locator('#raw-data')
    const innerHTML = await dataDiv.innerHTML()
    expect(innerHTML).toContain('id')
    expect(innerHTML).toContain('name')
    expect(innerHTML).toContain('custom_value')
  })

  test('Basic CRUD test', async () => {
    // render in browser
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })

    // go through SELECT-INSERT-UPDATE-DELETE cycle

    // DELETE - extra delete to make sure record didn't hang in there
    // TODO replace with test-specific text key for each test
    await page.click('#delete-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/delete') && response.ok(),
    )

    // SELECT - no record with "test" should be in DB
    await page.click('#select-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/select') && response.ok(),
    )
    const selectData = page.locator('#select-data')
    let selectHTML = await selectData.innerHTML()
    expect(selectHTML).toContain('[]')

    // INSERT - new "test" record should be inserted
    await page.click('#insert-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/insert') && response.ok(),
    )
    const insertData = page.locator('#insert-data')
    const insertHTML = await insertData.innerHTML()
    expect(insertHTML).toContain('OK')

    // SELECT - should contain data with value "0" now
    await page.click('#select-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/select') && response.ok(),
    )
    selectHTML = await selectData.innerHTML()
    expect(selectHTML).toContain('id')
    expect(selectHTML).toContain('0')

    // UPDATE - value should be changed to "1"
    await page.click('#update-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/update') && response.ok(),
    )
    const updateData = page.locator('#update-data')
    const updateHTML = await updateData.innerHTML()
    expect(updateHTML).toContain('OK')

    // SELECT - should contain data with value "1" now
    await page.click('#select-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/select') && response.ok(),
    )
    selectHTML = await selectData.innerHTML()
    expect(selectHTML).toContain('id')
    expect(selectHTML).toContain('1')

    // DELETE - test record should be deleted
    await page.click('#delete-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/delete') && response.ok(),
    )
    const deleteData = page.locator('#delete-data')
    const deleteHTML = await deleteData.innerHTML()
    expect(deleteHTML).toContain('OK')

    // SELECT - should contain no "test" data again
    await page.click('#select-button')
    await page.waitForResponse(response =>
      response.url().includes('/api/_neon/select') && response.ok(),
    )
    selectHTML = await selectData.innerHTML()
    expect(selectHTML).toContain('[]')
  })
})
