import { getNeonClient } from '../utils/getNeonClient'
import { update } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): Promise<Array<string>> => {
  const body = await readBody(event)
  const neon = getNeonClient()

  const ret = await update(neon, body.table, body.values, body.where)

  // successful UPDATE operation returns []
  if (ret.length === 0) {
    console.log('UPDATE OK')
    return ['OK']
  }
  else {
    console.log('UPDATE ERROR')
    return ['ERROR']
  }
})
