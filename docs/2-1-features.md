# Nuxt Neon module features

## Server-side features 🌞

> [!TIP]
> **It is advised only to use Nuxt Neon module server-side**. You should keep your DB operations sealed behind Nuxt runtime server and only expose custom API endpoints to your client-side.

To obtain the instance of [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver), you can use:

```ts
const neon = getNeonClient()
```

This instance needs to be passed as the first parameter to following health check utils:

- `isOk` - simple health check returning `true` if the connection works
- `neonStatus` - more detailed health check returning a status object

Or to one of the available server-side SQL wrappers:

- `count` - server-side COUNT wrapper
- `select` - server-side SELECT wrapper
- `insert` - server-side INSERT wrapper
- `update` - server-side UPDATE wrapper
- `del` - server-side DELETE wrapper
- `raw` - server-side function for RAW SQL (discouraged)

For full reference visit the [server-side features](./2-2-features-server.md) page.

## Client-side features 🥶

> [!CAUTION]
> **Exposing database connection to the client side is a serious security risk!** While Nuxt Neon technically allows accessing the Neon database quasi-directly from the client side via a set of wrapper functions and exposed API endpoints, it is advised not to use them in production.

Client-side counterparts of the server-side features mentioned above are also available. However, since the service API endpoints are exposed to anyone who can reach the server (effectively anyone for the public applications), this opens a wide surface for potential attacks. We are trying to mitigate risks by additional security measures (like whitelisted tables or adding authentication for the calls), but remember that this is an open-source project and any possible flaws can be found and exploited by malicious actors.

To ensure everyone knows what they are doing, using Nuxt Neon client-side is **disabled by default**. Or more precisely, using the methods will produce just errors. If you are 100% your application cannot be compromised (i.e. it is running in a trusted and shielded intranet environment) or it is just a tech demo or something expendable, you can enable client-side features by setting module option `neonExposeEndpoints: true` or environment variable `NUXT_PUBLIC_NEON_EXPOSE_ENDPOINTS=true`.

Once enabled, you can use following client-side features via [`useNeon` composable](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/composables/useNeon.ts).

Available health checks:

  - `isOk` - simple health check
  - `neonStatus` - detailed health check

Available client-side SQL wrappers:

  - `count` - client-side COUNT wrapper
  - `select` - client-side SELECT wrapper
  - `insert` - client-side INSERT wrapper
  - `update` - client-side UPDATE wrapper
  - `del` - client-side DELETE wrapper
  - `raw` - client-side RAW wrapper (extra discouraged)

For full reference visit the [client-side features](./2-3-features-client.md) page.
