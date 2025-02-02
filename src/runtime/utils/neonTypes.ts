export type SSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

export type NeonStatusResult = {
  database: string
  status: 'OK' | 'ERR'
  debugInfo?: string
}
