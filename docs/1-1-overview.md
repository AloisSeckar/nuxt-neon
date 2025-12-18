# Nuxt Neon

A simple Nuxt module allowing smooth integration with Neon database.

## How to use?

Install the module to your Nuxt application with one command:

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

Note this will allow to disclose your database name on client side, which you might or might not want to do. If both env variables are set, `NUXT_NEON_DB` is always used for the actual connection string, but value of `NUXT_PUBLIC_NEON_DB` becomes available on client side.

Nuxt Neon will construct a PostgreSQL connection string based on given values:

```ts
`postgresql://${NUXT_NEON_USER}:${NUXT_NEON_PASS}@${NUXT_NEON_HOST}.neon.tech/${NUXT[_PUBLIC]NEON_DB}`
```

Settings are used to initialize the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) object initialized on the Nuxt server.

**NOTE:** Sensitive connection data are sealed within the Nuxt server (Nitro). The only public property might be the database name (if you pick the public variant). On the other hand, this means you cannot use **Nuxt Neon** in static builds and deploy without JS runtime.

That's it! Your Nuxt app is now connected to a Neon database instance ✨

## More info

- Continue to the [features](/2-1-features) for summary of what is available.
- See [changelog](/3-1-changelog.html) to display the latest changes.
- Visit [contributing guide](/4-1-contributing.html) if you want to help with development.
