<template>
  <h3 id="count">
    COUNT
  </h3>
  <button
    id="count-button"
    @click="doCount"
  >
    Execute
  </button>
  <div id="count-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { count } = useNeon()

const result = ref(-2) // initial state for test
async function doCount() {
  result.value = await count(
    'playing_with_neon',
    [{ column: 'name', condition: 'LIKE', value: '\'test%\'' }],
  ) as number
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
