# Shared features

This is available both on server and client side.

### Error handling

When an error is occured and caught within the module, an instance of `NeonError` is returned instead of expected data. 

Utility functions `isNeonSuccess(obj: unknown): boolean` and `isNeonError(obj: unknown): boolean` can be used to verify the results. 

Utility `formatNeonError(err: NeonError): string` can be used to print out error data in a consistent way.
