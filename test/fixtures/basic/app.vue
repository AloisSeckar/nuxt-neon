<template>
  <h1>Nuxt-Neon TEST</h1>
  <strong>Neon data:</strong>
  <div
    v-if="data"
    id="data"
  >
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { raw } = useNeon()

const { data } = await useAsyncData('neonTest', () => raw('SELECT * FROM playing_with_neon'))
</script>
