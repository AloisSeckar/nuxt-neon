import { $fetch } from '@nuxt/test-utils/e2e'
import { describe, test } from 'vitest'

describe('Server-side schema validation test suite', () => {
  // checks if Valibot properly identifies and rejects flawed request bodies for server-side API endpoints

  test('SELECT - should NOT allow empty body', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: {},
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow unknown attribute', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: { attr: 'value' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow body missing required `columns`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: { from: 'playing_with_neon' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow body missing required `from`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: { columns: '*' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow wrong type for `columns`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: { columns: 42, from: 'playing_with_neon' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow wrong type for `from`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: { columns: '*', from: 42 },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow unknown `where` operator', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: {
        columns: '*',
        from: 'playing_with_neon',
        where: { column: 'name', operator: 'NOT_A_REAL_OPERATOR', value: '\'test\'' },
      },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('SELECT - should NOT allow wrong type for `limit`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/select', {
      method: 'POST',
      body: { columns: '*', from: 'playing_with_neon', limit: 'ten' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('COUNT - should NOT allow empty body', async ({ expect }) => {
    const result = await $fetch('/api/_neon/count', {
      method: 'POST',
      body: {},
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('COUNT - should NOT allow unknown attribute', async ({ expect }) => {
    const result = await $fetch('/api/_neon/count', {
      method: 'POST',
      body: { attr: 'value' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('COUNT - should NOT allow body missing required `from`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/count', {
      method: 'POST',
      body: { where: { column: 'name', operator: 'LIKE', value: '\'test%\'' } },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('COUNT - should NOT allow wrong type for `from`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/count', {
      method: 'POST',
      body: { from: 42 },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('COUNT - should NOT allow unknown `where` operator', async ({ expect }) => {
    const result = await $fetch('/api/_neon/count', {
      method: 'POST',
      body: {
        from: 'playing_with_neon',
        where: { column: 'name', operator: 'NOT_A_REAL_OPERATOR', value: '\'test\'' },
      },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('INSERT - should NOT allow empty body', async ({ expect }) => {
    const result = await $fetch('/api/_neon/insert', {
      method: 'POST',
      body: {},
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('INSERT - should NOT allow unknown attribute', async ({ expect }) => {
    const result = await $fetch('/api/_neon/insert', {
      method: 'POST',
      body: { attr: 'value' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('INSERT - should NOT allow body missing required `table`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/insert', {
      method: 'POST',
      body: { values: { name: 'test' } },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('INSERT - should NOT allow body missing required `values`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/insert', {
      method: 'POST',
      body: { table: 'playing_with_neon' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('INSERT - should NOT allow wrong type for `table`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/insert', {
      method: 'POST',
      body: { table: 42, values: { name: 'test' } },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('INSERT - should NOT allow wrong type for `values`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/insert', {
      method: 'POST',
      body: { table: 'playing_with_neon', values: 'not-a-record' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow empty body', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: {},
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow unknown attribute', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: { attr: 'value' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow body missing required `table`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: { values: { name: 'test' } },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow body missing required `values`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: { table: 'playing_with_neon' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow wrong type for `table`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: { table: 42, values: { name: 'test' } },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow wrong type for `values`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: { table: 'playing_with_neon', values: 'not-a-record' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('UPDATE - should NOT allow unknown `where` operator', async ({ expect }) => {
    const result = await $fetch('/api/_neon/update', {
      method: 'POST',
      body: {
        table: 'playing_with_neon',
        values: { name: 'test' },
        where: { column: 'name', operator: 'NOT_A_REAL_OPERATOR', value: '\'test\'' },
      },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('DELETE - should NOT allow empty body', async ({ expect }) => {
    const result = await $fetch('/api/_neon/delete', {
      method: 'POST',
      body: {},
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('DELETE - should NOT allow unknown attribute', async ({ expect }) => {
    const result = await $fetch('/api/_neon/delete', {
      method: 'POST',
      body: { attr: 'value' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('DELETE - should NOT allow body missing required `table`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/delete', {
      method: 'POST',
      body: { where: { column: 'name', operator: 'LIKE', value: '\'test%\'' } },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('DELETE - should NOT allow wrong type for `table`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/delete', {
      method: 'POST',
      body: { table: 42 },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('DELETE - should NOT allow unknown `where` operator', async ({ expect }) => {
    const result = await $fetch('/api/_neon/delete', {
      method: 'POST',
      body: {
        table: 'playing_with_neon',
        where: { column: 'name', operator: 'NOT_A_REAL_OPERATOR', value: '\'test\'' },
      },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('RAW - should NOT allow empty body', async ({ expect }) => {
    const result = await $fetch('/api/_neon/raw', {
      method: 'POST',
      body: {},
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('RAW - should NOT allow unknown attribute', async ({ expect }) => {
    const result = await $fetch('/api/_neon/raw', {
      method: 'POST',
      body: { attr: 'value' },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })

  test('RAW - should NOT allow wrong type for `query`', async ({ expect }) => {
    const result = await $fetch('/api/_neon/raw', {
      method: 'POST',
      body: { query: 42 },
    })
    expect(result).toMatchObject({ name: 'NuxtNeonServerError', code: 400 })
  })
})
