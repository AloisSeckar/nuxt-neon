# Nuxt Neon

Nuxt module allowing smooth integration with Neon database

[Neon](https://neon.com/) is a serverless [PostgreSQL](https://www.postgresql.org/) database provider, offering scalable and efficient database solutions for modern applications. They are shipping raw SQL interface via their [serverless driver](https://neon.tech/docs/serverless/serverless-driver) allowing easy integration with various platforms. This module builds upon this driver allowing you to start working with Neon in [Nuxt v4](https://nuxt.com/) application right away.

## How to use?

Install the module to your Nuxt application via [Nuxt DevTools](https://devtools.nuxt.com/guide/features#modules) or manually with one command:

```bash
npx nuxi module add nuxt-neon
```

Provide connection details to your Neon DB instance through a set of Nuxt [runtime config variables](https://nuxt.com/docs/4.x/guide/going-further/runtime-config):
- `NUXT_NEON_HOST`
- `NUXT_NEON_USER`
- `NUXT_NEON_PASS`
- `NUXT_NEON_DB`

For database name, you can alternatively set:
- `NUXT_PUBLIC_NEON_DB`

The latter will allow to disclose your database name on client side, which you might or might not want to do. If both env variables are set, `NUXT_NEON_DB` is always used for the actual connection string, but value of `NUXT_PUBLIC_NEON_DB` becomes available on client side.

Nuxt Neon will construct a PostgreSQL connection string based on given values:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT[_PUBLIC]NEON_DB}`
```

And use it to create Neon serverless driver instance on the Nuxt server. The instance can be obtained from [the utility class](https://github.com/AloisSeckar/nuxt-neon/blob/master/src/runtime/server/utils/getNeonClient.ts) as:

```ts
const neon = getNeonClient()
```

Like that, sensitive connection data are sealed within the Nuxt server. The only public property might be the database name (if you pick the public variant). On the other hand, this means **you cannot use Nuxt Neon in static builds** and deploy without JS runtime.

That's it! Your Nuxt app is now connected to a Neon database instance ✨

## More info

- Continue to the [features](/2-1-features) for summary of what else is available.
- See [changelog](/3-1-changelog.html) to display the latest changes.
- Visit [contributing guide](/4-1-contributing.html) if you want to help with development.
