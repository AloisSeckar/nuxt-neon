<template>
  <h1>Nuxt-Neon TEST</h1>
  <strong>Neon data:</strong><br>{{ data }}
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { raw } = useNeon()

const { data } = await useAsyncData('neonTest', () => raw('SELECT * FROM playing_with_neon'))
</script>
