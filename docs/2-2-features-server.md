# Server-side features 🌞

> [!TIP]
> **It is advised only to use Nuxt Neon module server-side**. You should keep your DB operations sealed behind Nuxt runtime server and only expose custom API endpoints to your client-side.

## Neon serverless driver

Nuxt Neon is connecting into your Neon database using the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver). 

The connection is configured via a set of Nuxt private [runtime config variables](https://nuxt.com/docs/4.x/guide/going-further/runtime-config):

```sh [.env]
NUXT_NEON_HOST=your-neon-host
NUXT_NEON_USER=your-neon-user
NUXT_NEON_PASS=your-neon-password
NUXT_NEON_DB=your-neon-database
```

Nuxt Neon uses them to costruct a PostgreSQL connection string:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT[_PUBLIC]NEON_DB}`
```

And instantiates the Neon serverless driver on the Nuxt server with it inside [simple utility class](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/server/utils/useNeonDriver.ts). The result is a function that underlying Neon driver uses to establish the connection into the serverless PostgreSQL database. Like that, sensitive connection data are sealed within the Nuxt server. On the other hand, this means **you cannot use Nuxt Neon in static builds** and deploy without JS runtime.

Right now, the function is singleton-like, meaning you can create only one per Nuxt application. If different behavior is needed, please [open an issue](https://github.com/AloisSeckar/nuxt-neon/issues).

The function can be obtained as:

```ts
const { neon } = useNeonDriver()
```

If you need, you can use it exactly as described in the [Neon docs](https://neon.tech/docs/serverless/serverless-driver) to build your fully custom solutions.

Alternatively, this driver instance is required to be passed into server-side health check utils and SQL wrapper functions that are described below:

## Health checks

TODO

## SQL wrappers

TODO
