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
  <div id="count-result">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeonClient } from '#imports'

const { count } = useNeonClient()

const result = ref(-2) // initial state for test
async function doCount() {
  result.value = await count({
    from: 'playing_with_neon',
    where: [{ column: 'name', operator: 'LIKE', value: '\'test%\'' }],
  }) as number
}
</script>
