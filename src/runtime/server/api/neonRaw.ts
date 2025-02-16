import { getNeonClient } from '../utils/getNeonClient'
import { NEON_RAW_WARNING } from '../../utils/neonMessages'
import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const neon = getNeonClient()
  if (useRuntimeConfig().public.rawWarning) {
    console.warn(NEON_RAW_WARNING)
  }
  return await neon(body.query)
})
