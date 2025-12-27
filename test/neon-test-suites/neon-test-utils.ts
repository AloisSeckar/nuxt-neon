import { createPage, url, type NuxtPage } from '@nuxt/test-utils/e2e'

export async function gotoPage(pageName: string) {
  const page = await createPage()
  await page.goto(url(`/${pageName}`), { waitUntil: 'hydration' })
  return page
}

export async function getDataHtml(pageName: string) {
  // pick div with data and return the inner html
  const page = await gotoPage(pageName)
  const dataDiv = page.locator('#data')
  return await dataDiv.innerHTML()
}

export function countIds(html: string) {
  return (html.match(/"id"/g) || []).length
}

type NeonAction = 'count' | 'select' | 'insert' | 'update' | 'delete' | 'raw'

// render the page then click specified button and collect the result
export async function getActionResult(pageName: string, action: NeonAction) {
  const page = await gotoPage(pageName)
  return await getButtonClickResult(page, action)
}

// click specified button, wait for response and collect the result
export async function getButtonClickResult(page: NuxtPage, action: NeonAction) {
  await page.click(`#${action}-button`)
  await page.waitForResponse(response =>
    response.url().includes(`/api/_neon/${action}`) && response.ok(),
  )
  const resultDiv = page.locator(`#${action}-result`)
  return await resultDiv.innerHTML()
}
