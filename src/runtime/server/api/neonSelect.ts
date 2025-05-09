import type { H3Event, EventHandlerRequest } from 'h3'
import { getNeonClient } from '../utils/getNeonClient'
import { select } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async <T> (event: H3Event<EventHandlerRequest>): Promise<Array<T>> => {
  const body = await readBody(event)
  const neon = getNeonClient()

  const results = await select(neon, body.columns, body.from, body.where, body.order, body.limit)
  return results as Array<T>
})
