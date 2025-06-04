import type { H3Event, EventHandlerRequest } from 'h3'
import type { NeonDataType } from '../../utils/neonTypes'
import { getNeonClient } from '../utils/getNeonClient'
import { parseNeonClientError } from '../utils/neonErrors'
import { select } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<NeonDataType<T>> => {
  try {
    const body = await readBody(event)
    const neon = getNeonClient()

    const results = await select(neon, { ...body })
    return results as Array<T>
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/select', err)
  }
})
