# Nuxt Neon

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

![nuxt-neon](https://github.com/user-attachments/assets/35d6c6dd-5063-4501-ac2a-86bebec53abf)

Nuxt Neon is a [Nuxt v4-compilant module](https://nuxt.com/modules) allowing smooth integration with [Neon database](https://neon.tech/).

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
  
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

See [the documentation](https://nuxt-neon.netlify.app/) for more info.

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-neon/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-neon

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-neon.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-neon

[license-src]: https://img.shields.io/npm/l/nuxt-neon.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://github.com/AloisSeckar/nuxt-neon/blob/master/LICENSE

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
