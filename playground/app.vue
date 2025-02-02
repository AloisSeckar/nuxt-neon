<template>
  <h1>Nuxt-Neon</h1>
  <div class="info">
    This is a simple Nuxt module alowing smooth integration with Neon database
  </div>
  <div class="info">
    The module provides `useNeon()` composable exposing methods to send SQL queries to underlaying Neon DB
  </div>
  <div class="info">
    The connection string is constructed using four Nuxt runtime variables:
  </div>
  <ul>
    <li><pre>NUXT_NEON_HOST</pre></li>
    <li><pre>NUXT_NEON_USER</pre></li>
    <li><pre>NUXT_NEON_PASS</pre></li>
    <li><pre>NUXT_PUBLIC_NEON_DB</pre></li>
  </ul>
  <h2>Test</h2>
  <div class="info">
    Neon status: {{ dbStatus.status }}
  </div>
  <div class="info">
    Connection: {{ connectionOpen }}
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
  <h3>SQL Wrappers test</h3>
  <TestInsert />
  <TestSelect />
  <TestUpdate />
  <TestDelete />
  <TestRaw />
</template>

<script setup lang="ts">
const { neonStatus, isOk, raw } = useNeon()
// health checks
const dbStatus = await neonStatus()
const connectionOpen = await isOk()
// get sample data
const { data, status, error } = await useAsyncData('neonTest', () => raw('SELECT * FROM playing_with_neon'))
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
