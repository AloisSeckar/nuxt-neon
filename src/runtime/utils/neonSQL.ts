import type { NeonQueryFunction } from '@neondatabase/serverless'

export async function insert(neon: NeonQueryFunction<false, false>, columns: string[], from: string[], where?: string[], order?: string, limit?: number) {
  let sqlString = 'SELECT '
  sqlString += columns.join(', ')

  sqlString += ' FROM '
  sqlString += from.join(' JOIN ')

  if (where) {
    sqlString += ' WHERE '
    sqlString += where.join(' AND ')
  }

  if (order) {
    sqlString += ` ORDER BY ${order}`
  }

  if (limit) {
    sqlString += ` LIMIT ${limit}`
  }

  console.log(sqlString)

  return await neon(sqlString)
}

export async function update(neon: NeonQueryFunction<false, false>, table: string, values: Record<string, string>, where?: string[]) {
  let sqlString = 'UPDATE '
  sqlString += table

  sqlString += ' SET '
  Object.entries(values).forEach(([key, value]) => {
    sqlString += `${key} = '${value}',`
  })
  sqlString = sqlString.slice(0, -1) // remove last comma

  if (where) {
    sqlString += ' WHERE '
    sqlString += where.join(' AND ')
  }

  console.log(sqlString)

  return await neon(sqlString)
}