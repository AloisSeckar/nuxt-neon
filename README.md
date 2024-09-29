# Nuxt-Neon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A simple [Nuxt module](https://nuxt.com/modules) alowing smooth integration with [Neon database](https://neon.tech/).

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## How to use?

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-neon
```

Provide connection details to your Neon DB instance through a set of Nuxt [runtime config variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables):
- `NUXT_PUBLIC_NEON_HOST`
- `NUXT_PUBLIC_NEON_USER`
- `NUXT_PUBLIC_NEON_PASS`
- `NUXT_PUBLIC_NEON_DB`

Nuxt-Neon will construct a PostgreSQL connection string based on given values:

```ts
`postgresql://${NUXT_PUBLIC_NEON_USER}:${NUXT_PUBLIC_NEON_PASS}@${NUXT_PUBLIC_NEON_HOST}.neon.tech/${NUXT_PUBLIC_NEON_DB}`
```

It will be used to initialize the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) object exposed via `useNeon` composable:

```ts
const { neonClient } = useNeon()
```

Provided Neon client object is capable of making direct SQL queries to connected database.

You can use either tagged template syntax:

```ts
neonClient`SELECT * FROM playing_with_neon`
```

Or the traditional function syntax:

```ts
neonClient('SELECT * FROM playing_with_neon')
```

That's it! Your Nuxt app is now connected to a Neon database instance ✨

### Health check

Current status of the connection can be quickly checked by calling async function `isOk` provided by `useNeon` composable: 

```ts
const { isOk } = useNeon()
```

The return value `true/false` is based on more complex probe function `neonStatus` which is also available:

```ts
const { neonStatus } = useNeon()
```

The test is performed by firing a `SELECT 1=1` query to the current `neonClient`.

The function takes two optional parameters:
- `anonymous: boolean = true` - if set to `false`, it will disclose username and password [**WARNING**: may expose sensitive data! Use with caution]
- `debug: boolean = false` - if set to `true`, if will append the root cause returned by Neon driver [**WARNING**: may expose sensitive data! Use with caution]

Value returned is a `NeonStatusResult` promise:
- `connectionString: string` - connection string that was used to initialize current `neonClient` (USER and PASS are anonymized, if `anonymous = true`)
- `status: 'OK' | 'ERR'` - `OK` if connection works, `ERR` if error occured
- `debug?: string` - Neon driver error, if `status = 'ERR'` and `debug = true`

## Module options

Nuxt-Neon can be configured by overriding the default options values using key `neon` inside `nuxt.config.ts`.

Existing options:

- `sslMode` - allows setting [secure connection mode](https://neon.tech/docs/connect/connect-securely) when constructing the DB connection string by adding `sslmode` parameter to URL. Values can be:
  - `require` (default)
  - `verify-ca`
  - `verify-full`
  - `none` (sslmode is **not** inclued in the connection string)

Example:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  neon: {
    sslMode: 'verify-full',
  },
  // other configuration
})
```

## See also

- [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) for the full reference of provided features like the `transaction()` function.

## Contribution

Contributions welcome! Let's make this module better together.

 Contact https://github.com/AloisSeckar for more info.

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-neon

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-neon

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/AloisSeckar/nuxt-neon/blob/master/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
