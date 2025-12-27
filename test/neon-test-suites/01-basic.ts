import { describe, test, expect } from 'vitest'
import { getButtonClickResult, gotoPage } from './neon-test-utils'

describe('nuxt-neon basic test suite', () => {
  test('Neon demo app loaded and DB connected', async () => {
    // render in browser
    const page = await gotoPage('TestBasic')

    // title was rendered
    const hasText = await page.getByText('Nuxt Neon TEST APP').isVisible()
    expect(hasText).toBeTruthy()

    // isOk() method returns "true"
    const connectionDiv = page.locator('#connection')
    expect(connectionDiv).toBeDefined()
    const connectionHTML = await connectionDiv.innerHTML()
    expect(connectionHTML).toContain('true')

    // status() method returns OK status
    const statusDiv = page.locator('#status')
    expect(statusDiv).toBeDefined()
    const statusHTML = await statusDiv.innerHTML()
    expect(statusHTML).toContain('"database":"elrh-neon"')
    expect(statusHTML).toContain('"status":"OK"')
    expect(statusHTML).toContain('"debugInfo":""')
  }, 10000) // first test in suite often needs longer timeout

  // this was added to prevent https://github.com/AloisSeckar/nuxt-neon/issues/39
  // it should ensure the initial database data are as expected
  test('Initial cleanup was executed', async () => {
    // render in browser
    const page = await gotoPage('TestCleanup')
    // click the "delete" button and wait for response
    await page.click('#delete-button')
    await page.waitForResponse(response => response.ok())
  })

  test('All test components are rendered', async () => {
    // render in browser
    const page = await gotoPage('TestBasic')

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
  }, 10000) // longer timeout to avoid unnecessary failures

  test('Basic DATA FETCHING test', async () => {
    // render in browser
    const page = await gotoPage('TestBasic')

    // check contents
    const innerHTML = await getButtonClickResult(page, 'raw')
    expect(innerHTML).toContain('"id"')
    expect(innerHTML).toContain('"name"')
    expect(innerHTML).toContain('"custom_value"')
  }, 10000) // longer timeout to avoid unnecessary failures

  test('Basic CRUD test', async () => {
    // render in browser
    const page = await gotoPage('TestBasic')

    // go through full SELECT-INSERT-UPDATE-DELETE cycle

    // DELETE - extra delete to make sure record didn't hang in there
    await getButtonClickResult(page, 'delete')

    // SELECT - no record with "test" should be in DB
    let selectHTML = await getButtonClickResult(page, 'select')
    expect(selectHTML).toContain('[]')

    // COUNT - should return 0 now
    let countHTML = await getButtonClickResult(page, 'count')
    expect(countHTML).toContain('0')

    // INSERT - new "test" record should be inserted
    const insertHTML = await getButtonClickResult(page, 'insert')
    expect(insertHTML).toContain('OK')

    // SELECT - should contain data with value "0" now
    selectHTML = await getButtonClickResult(page, 'select')
    expect(selectHTML).toContain('id')
    expect(selectHTML).toContain('0')

    // COUNT - should return 1 now
    countHTML = await getButtonClickResult(page, 'count')
    expect(countHTML).toContain('1')

    // UPDATE - value should be changed to "1"
    const updateHTML = await getButtonClickResult(page, 'update')
    expect(updateHTML).toContain('OK')

    // SELECT - should contain data with value "1" now
    selectHTML = await getButtonClickResult(page, 'select')
    expect(selectHTML).toContain('id')
    expect(selectHTML).toContain('1')

    // DELETE - test record should be deleted
    const deleteHTML = await getButtonClickResult(page, 'delete')
    expect(deleteHTML).toContain('OK')

    // SELECT - should contain no "test" data again
    selectHTML = await getButtonClickResult(page, 'select')
    expect(selectHTML).toContain('[]')

    // COUNT - should return 0 again
    countHTML = await getButtonClickResult(page, 'count')
    expect(countHTML).toContain('0')
  }, 10000) // this occasionally times out for no apparent reason (usually on the first run)
})
