<template>
  <h1>Nuxt-Neon</h1>
  <div class="info">
    This is a simple Nuxt module alowing smooth integration with Neon database
  </div>
  <div class="info">
    The module provides `useNeon()` composable exposing `neonClient` object allowing to make direct SQL queries to underlaying DB
  </div>
  <div class="info">
    The connection string is constructed using four Nuxt runtime variables:
  </div>
  <ul>
    <li><pre>NUXT_PUBLIC_NEON_HOST</pre></li>
    <li><pre>NUXT_PUBLIC_NEON_USER</pre></li>
    <li><pre>NUXT_PUBLIC_NEON_PASS</pre></li>
    <li><pre>NUXT_PUBLIC_NEON_DB</pre></li>
  </ul>
  <h2>Test</h2>
  <div class="info">
    {{ dbStatus }}
  </div>
  <div v-if="status === 'pending'">
    Fetching data...
  </div>
  <div v-if="data">
    <strong>Neon data:</strong><br>{{ data }}
  </div>
  <div v-if="error">
    <strong>Failed to fetch data</strong>
  </div>
</template>

<script setup lang="ts">
const { neonClient, neonStatus } = useNeon()
const dbStatus = await neonStatus()
const { data, status, error } = await useAsyncData(() => neonClient`SELECT * FROM playing_with_neon`)
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
