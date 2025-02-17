export type SSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

export type NeonStatusResult = {
  database: string
  status: 'OK' | 'ERR'
  debugInfo?: string
}

export type NeonTableQuery = {
  table: string
  alias: string
  idColumn1?: string
  idColumn2?: string
}

export type NeonWhereQuery = {
  column: string
  relation: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'LIKE'
  value: string
  operator?: 'AND' | 'OR'
}

export type NeonOrderQuery = {
  column: string
  direction?: 'ASC' | 'DESC'
}
