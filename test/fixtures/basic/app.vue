<template>
  <h1>Nuxt-Neon TEST</h1>
  <strong>Neon data:</strong><br>{{ data }}
</template>

<script setup lang="ts">
import { useAsyncData } from '#imports'

const { data } = await useAsyncData('neonTest', () => $fetch('/api/_neon/raw', {
  method: 'POST',
  body: { query: 'SELECT * FROM playing_with_neon' },
}))
</script>
