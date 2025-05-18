<template>
  <h1>Nuxt-Neon DELETE TEST</h1>
  <!-- <NuxtPage /> -->
  <h2 id="delete">
    Clean-up after each test run
  </h2>
  <button
    id="delete-button"
    @click="doDelete"
  >
    Execute delete
  </button>
  <div id="delete-result">
    {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { del } = useNeon()

const result = ref('')
async function doDelete() {
  result.value = await del(
    'playing_with_neon',
    [{ column: 'id', condition: '>', value: '10' }],
  ) as string
}
</script>
