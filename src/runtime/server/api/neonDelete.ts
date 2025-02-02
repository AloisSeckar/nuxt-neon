import { getNeonClient } from '../utils/getNeonClient'
import { del } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const neon = getNeonClient()
  return await del(neon, body.table, body.where)
})
