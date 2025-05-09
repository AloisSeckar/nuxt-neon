import { getNeonClient } from '../utils/getNeonClient'
import { insert } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): Promise<Array<string>> => {
  const body = await readBody(event)
  const neon = getNeonClient()

  const ret = await insert(neon, body.table, body.values, body.columns)

  // successful INSERT operation returns []
  if (ret.length === 0) {
    return ['OK']
  }
  else {
    return ['ERROR']
  }
})
