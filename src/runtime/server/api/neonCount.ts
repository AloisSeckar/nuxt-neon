import { getNeonClient } from '../utils/getNeonClient'
import { count } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): Promise<Array<number>> => {
  const body = await readBody(event)
  const neon = getNeonClient()
  // result is returned as [ { count: 'n' } ]
  const countData = await count(neon, body.from, body.where) as { count: number }[]
  // extract only the number
  // or return -1 if response cannot be parsed
  return [countData?.at(0)?.count || -1]
})
