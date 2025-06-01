import type { NeonDataType } from '../../utils/neonTypes'
import { getNeonClient } from '../utils/getNeonClient'
import { getGenericError, parseNeonClientError } from '../utils/neonErrors'
import { insert } from '../utils/neonSQL'
import { defineEventHandler, readBody } from '#imports'

export default defineEventHandler(async (event): NeonDataType<string> => {
  try {
    const body = await readBody(event)
    const neon = getNeonClient()

    const ret = await insert(neon, { ...body })

    // successful INSERT operation returns []
    if (ret.length === 0) {
      return ['OK']
    }
    else {
      console.debug(ret)
      // TODO can we extract more detailed error cause from within the driver response?
      return await getGenericError('/api/_neon/insert', 'INSERT operation failed')
    }
  }
  catch (err) {
    return await parseNeonClientError('/api/_neon/insert', err)
  }
})
