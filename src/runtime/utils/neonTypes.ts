export type SSLModeOption = 'require' | 'verify-ca' | 'verify-full' | 'none'

export type NeonStatusResult = {
  connectionString: string
  status: 'OK' | 'ERR'
  debugInfo?: string
}
