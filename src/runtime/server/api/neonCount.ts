import type { NeonDataType } from '../../utils/neonTypes'
import { getNeonClient } from '../utils/getNeonClient'
import { parseNeonClientError } from '../utils/neonErrors'
import { count } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): NeonDataType<number> => {
  try {
    const body = await readBody(event)
    const neon = getNeonClient()
    // result is returned as [ { count: 'n' } ]
    const countData = await count(neon, { ...body }) as { count: number }[]
    // extract only the number
    // or return -1 if response cannot be parsed
    return [countData?.at(0)?.count || -1]
  }
  catch (err) {
    return parseNeonClientError('/api/_neon/count', err)
  }
})
