<template>
  <h1>Nuxt-Neon TEST</h1>
  <strong>Neon data:</strong><br>{{ data }}
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { neonClient } = useNeon()
const { data } = await useAsyncData(() => neonClient`SELECT * FROM playing_with_neon`)
</script>
