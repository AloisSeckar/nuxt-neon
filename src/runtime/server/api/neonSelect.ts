import type { H3Event, EventHandlerRequest } from 'h3'
import { getNeonClient } from '../utils/getNeonClient'
import { parseNeonClientError } from '../utils/neonErrors'
import { select } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<Array<T> | NeonError> => {
  try {
    const body = await readBody(event)
    const neon = getNeonClient()

    const results = await select(neon, body.columns, body.from, body.where, body.order, body.limit, body.group, body.having)
    return results as Array<T>
  }
  catch (err) {
    return parseNeonClientError('/api/_neon/select', err)
  }
})
