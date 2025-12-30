# Nuxt Neon

Nuxt module allowing smooth integration with Neon database

[Neon](https://neon.com/) is a serverless [PostgreSQL](https://www.postgresql.org/) database provider, offering scalable and efficient database solutions for modern applications. They are shipping raw SQL interface via their [serverless driver](https://www.npmjs.com/package/@neondatabase/serverless) allowing easy integration with various platforms. This module builds upon this driver allowing you to start working with Neon in [Nuxt v4](https://nuxt.com/) application right away.

## How to use?

Install the module to your Nuxt application via [Nuxt DevTools](https://devtools.nuxt.com/guide/features#modules) or manually with command:

::: code-group
```sh [pnpm]
pnpx nuxi module add nuxt-neon
```

```sh [npm]
npx nuxi module add nuxt-neon
```

```sh [yarn]
yarn dlx nuxi module add nuxt-neon
```

```sh [bun]
$ bunx nuxi module add nuxt-neon
```

```sh [deno]
$ deno run --allow-run npm:npx nuxi module add nuxt-neon
```
:::

Provide connection details to your Neon DB instance through a set of Nuxt private [runtime config variables](https://nuxt.com/docs/4.x/guide/going-further/runtime-config):

```sh [.env]
NUXT_NEON_HOST=your-neon-host
NUXT_NEON_USER=your-neon-user
NUXT_NEON_PASS=your-neon-password
NUXT_NEON_DB=your-neon-database
```

Nuxt Neon will construct a PostgreSQL connection string based on given values:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT[_PUBLIC]NEON_DB}`
```

And use it to create Neon serverless driver instance on the Nuxt server. 

The instance can be obtained from [the utility class](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/server/utils/getNeonClient.ts) as:

```ts
const neon = getNeonClient()
```

Like that, sensitive connection data are sealed within the Nuxt server. On the other hand, this means **you cannot use Nuxt Neon in static builds** and deploy without JS runtime.

The driver instance alone is available at your dispose (server-side). Check [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) for the full reference of provided features like the `transaction()` function.

That's it! Your Nuxt app is now connected to a Neon database instance ✨

## More info

- Continue to the [features](/2-1-features) for summary of what else is available.
- See [changelog](/3-1-changelog.html) to display the latest changes.
- Visit [contributing guide](/4-1-contributing.html) if you want to help with development.
