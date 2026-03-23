// provide runtime config values into utility functions
// without making them dependant on `useRuntimeConfig`
// for easier unit testing

let scanEnabled = true

export function setNeonScanQueriesEnabled(value: boolean) {
  scanEnabled = value
}

export function isNeonScanQueriesEnabled() {
  return scanEnabled
}
