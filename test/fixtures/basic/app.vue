<template>
  <h1>Nuxt-Neon TEST</h1>
  <strong>Neon data:</strong><br>{{ data }}
</template>

<script setup lang="ts">
const neon = useNeon()
const { data } = await useAsyncData(() => neon.sql`SELECT * FROM playing_with_neon`)
</script>
