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

Provide connection details via env variables:

```sh [.env]
NUXT_NEON_HOST=your-neon-host
NUXT_NEON_USER=your-neon-user
NUXT_NEON_PASS=your-neon-password
NUXT_NEON_DB=your-neon-database
```

Obtain the [Neon serverless driver instance](https://neon.tech/docs/serverless/serverless-driver) on the Nuxt server with:

```ts
const { neon } = useNeonDriver()
```

That's it! Your Nuxt app is now connected to a Neon database instance ✨

> [!TIP]
> Note that Nuxt Neon module requires Nitro server runtime to work. Therefore, it cannot be used in static builds.

## More info

- Continue to the [features](/2-1-features) for a summary of what else is available.
- See [changelog](/3-1-changelog.html) to display the latest changes.
- Visit [contributing guide](/4-1-contributing.html) if you want to help with development.
