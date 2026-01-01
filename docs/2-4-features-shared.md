# Shared features

Following is available both on server and client side.

### Error handling

When an error occurs and is caught within the module, an instance of `NeonError` is produced and returned instead of expected data. 

```ts
type NeonError = {
  name: 'NuxtNeonServerError' | 'NuxtNeonClientError'
  source: string
  code: number
  message: string
  sql?: string
}
```

Utility functions `isNeonError` and its inverted counterpart `isNeonSuccess` can be used to identify such errors. 

```ts
const isNeonError = (obj: unknown): boolean

const isNeonSuccess = (obj: unknown): boolean
```

Utility `formatNeonError` can be used to print out error data in a consistent way.

```ts
const formatNeonError = (err: NeonError): string
```

Example usage:

```ts
// veryfing result of SQL wrapper call
if (isNeonSuccess(ret)) {
  // type assetion can be made  
  return ret as Array<T>
} else {
  // return error info as consistent string
  // `${ret.name} in ${ret.source}: ${ret.message} (status: ${ret.code})`
  return formatNeonError(ret)
}
```
