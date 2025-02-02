import { getNeonClient } from '../utils/getNeonClient'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const neon = getNeonClient()
  return await neon(body.query)
})
