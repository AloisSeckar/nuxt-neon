import { getNeonClient } from '../utils/getNeonClient'
import { select } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const neon = getNeonClient()
  return await select(neon, body.columns, body.from, body.where, body.order, body.limit)
})
