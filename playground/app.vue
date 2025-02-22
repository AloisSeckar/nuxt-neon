<template>
  <h1>nuxt-neon</h1>
  <img
    src="/nuxt-neon.png"
    title="nuxt-neon module"
    alt="nuxt-neon module logo"
    height="100"
  >
  <div class="info">
    This is a simple Nuxt module alowing smooth integration with <a href="https://neon.tech/home">Neon database</a>
  </div>
  <div class="info">
    The module provides `useNeon()` composable with methods + bunch of server-side routes to send SQL queries to the underlaying Neon DB using their <a href="https://neon.tech/docs/serverless/serverless-driver">JS/TS driver</a>
  </div>
  <div class="info">
    The connection string is constructed server-side using four Nuxt runtime variables:
  </div>
  <ul>
    <li><pre>NUXT_NEON_HOST</pre></li>
    <li><pre>NUXT_NEON_USER</pre></li>
    <li><pre>NUXT_NEON_PASS</pre></li>
    <li><pre>NUXT_PUBLIC_NEON_DB</pre></li>
  </ul>
  <h2>Features</h2>
  <h3>Health check probes</h3>
  <div class="info">
    <pre class="neon-code">const { isOk } = useNeon()</pre> <pre class="neon-result">{{ connectionOpen }}</pre>
  </div>
  <div class="info">
    <pre class="neon-code">const { neonStatus } = useNeon()</pre> <br> <pre class="neon-result">{{ dbStatus }}</pre>
  </div>
  <h3>SQL Wrappers</h3>
  <TestSelect />
  <TestInsert />
  <TestUpdate />
  <TestDelete />
  <TestRaw />
  <hr>
  <div class="info">
    &copy; {{ new Date().getFullYear() }} <a href="http://alois-seckar.cz">Alois Sečkár</a>
  </div>
</template>

<script setup lang="ts">
const { neonStatus, isOk } = useNeon()
const dbStatus = await neonStatus(false)
const connectionOpen = await isOk()
</script>

<style>
.info {
  margin-bottom: 5px;
}
.neon-code {
  display: inline;
}
.neon-result {
  display: inline;
  font-weight: 600;
}
</style>
