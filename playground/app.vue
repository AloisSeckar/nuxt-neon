<template>
  <h1>Nuxt-Neon</h1>
  <div v-if="status === 'pending'">
    Fetching data...
  </div>
  <div v-if="data">
    <strong>Neon data:</strong><br>{{ data }}
  </div>
  <div v-if="error">
    <strong>Error:</strong><br>{{ error }}
  </div>
</template>

<script setup lang="ts">
const { neonClient } = useNeon()
const { data, status, error } = await useAsyncData(() => neonClient`SELECT * FROM playing_with_neon`)
</script>
