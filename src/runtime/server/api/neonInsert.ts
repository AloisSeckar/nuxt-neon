import { getNeonClient } from '../utils/getNeonClient'
import { getGenericError, parseNeonClientError } from '../utils/neonErrors'
import { insert } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): Promise<Array<string> | NeonError> => {
  try {
    const body = await readBody(event)
    const neon = getNeonClient()

    const ret = await insert(neon, body.table, body.values, body.columns)

    // successful INSERT operation returns []
    if (ret.length === 0) {
      return ['OK']
    }
    else {
      console.debug(ret)
      // TODO can we extract more detailed error cause from within the driver response?
      return getGenericError('/api/_neon/insert', 'INSERT operation failed')
    }
  }
  catch (err) {
    return parseNeonClientError('/api/_neon/insert', err)
  }
})
