<template>
  <h3 id="update">
    UPDATE
  </h3>
  <button
    id="update-button"
    @click="doUpdate"
  >
    Execute update
  </button>
  <div id="update-result">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeonClient } from '#imports'

const { update } = useNeonClient()

const result = ref('')
async function doUpdate() {
  result.value = await update({
    table: 'playing_with_neon',
    values: { value: '1' },
    where: [{ column: 'name', operator: '=', value: '\'test\'' }],
  }) as string
}
</script>
