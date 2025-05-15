import { getNeonClient } from '../utils/getNeonClient'
import { getGenericError, parseNeonClientError } from '../utils/neonErrors'
import { update } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): NeonDataType<string> => {
  try {
    const body = await readBody(event)
    const neon = getNeonClient()

    const ret = await update(neon, body.table, body.values, body.where)

    // successful UPDATE operation returns []
    if (ret.length === 0) {
      return ['OK']
    }
    else {
      console.debug(ret)
      // TODO can we extract more detailed error cause from within the driver response?
      return getGenericError('/api/_neon/update', 'UPDATE operation failed')
    }
  }
  catch (err) {
    return parseNeonClientError('/api/_neon/update', err)
  }
})
