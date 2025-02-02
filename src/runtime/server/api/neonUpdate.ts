import { getNeonClient } from '../utils/getNeonClient'
import { update } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const neon = getNeonClient()
  return await update(neon, body.table, body.values, body.where)
})
