import { getNeonClient } from '../utils/getNeonClient'
import { NEON_RAW_WARNING, displayRawWarning } from '../../utils/neonWarnings'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const neon = getNeonClient()

  if (displayRawWarning()) {
    console.warn(NEON_RAW_WARNING)
  }

  return await neon.query(body.query)
})
