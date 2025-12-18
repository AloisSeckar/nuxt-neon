# Nuxt Neon module features

This is what Nuxt Neon has to offer.

## Server-side features 🌞

**It is advised ONLY to use Nuxt Neon module server-side.** 

Only expose custom data fetching endpoints tailored for your applications. This is currently the safest way to keepy your Neon database secured.

Following server-side util methods are exposed for usage in your server routes:
- `getNeonClient` - returns an instance on `neonClient` constructed based on config params
- `raw` - server-side function for RAW SQL queries, requires `neonClient` to be passed as 1st param (only recommeneded for edge cases)
- `count` - server-side COUNT wrapper, requires `neonClient` to be passed as 1st param
- `select` - server-side SELECT wrapper, requires `neonClient` to be passed as 1st param
- `insert` - server-side INSERT wrapper, requires `neonClient` to be passed as 1st param
- `update` - server-side UPDATE wrapper, requires `neonClient` to be passed as 1st param
- `del` - server-side DELETE wrapper, requires `neonClient` to be passed as 1st param
- `isOk` - server-side health check wrapper, requires `neonClient` to be passed as 1st param
- `neonStatus` - server-side detailed health check wrapper, requires `neonClient` to be passed as 1st param

For full reference visit the [server-side features](./2-2-features-server.md) page.

## Client-side features 🛑

**WARNING: Exposing database connection to the client side is a serious security risk.**

Nuxt Neon technically allows accessing the Neon database from the client side via a set of wrapper functions and exposed API endpoints. However, this way of using is disabled by default and it strongly recommended not to use it. 

If you are 100% your application cannot be compromised (i.e. it is running in a trusted and shielded intranet environment), you can enable the feature by setting module option `neonExposeEndpoints: true` or runtime config variable `NUXT_PUBLIC_NEON_EXPOSE_ENDPOINTS=true`.

Once enabled, you can use following client-side features via `useNeon` composable

- Health checks
  - `isOk` - simple health check
  - `neonStatus` - detailed health check
- Client-side SQL wrappers
  - `raw` - client-side RAW wrapper (extra discouraged*)
  - `count` - client-side COUNT wrapper
  - `select` - client-side SELECT wrapper
  - `insert` - client-side INSERT wrapper
  - `update` - client-side UPDATE wrapper
  - `del` - client-side DELETE wrapper

*) Needs module option `neonExposeRawEndpoint: true` or runtime config variable `NUXT_PUBLIC_NEON_EXPOSE_RAW_ENDPOINT=true` to be allowed.

For full reference visit the [client-side features](./2-3-features-client.md) page.
