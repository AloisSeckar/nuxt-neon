import { getNeonClient } from '../utils/getNeonClient'
import { del } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): Promise<Array<string>> => {
  const body = await readBody(event)
  const neon = getNeonClient()

  const ret = await del(neon, body.table, body.where)

  // successful DELETE operation returns []
  if (ret.length === 0) {
    return ['OK']
  }
  else {
    return ['ERROR']
  }
})
