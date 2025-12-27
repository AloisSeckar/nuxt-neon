<template>
  <h3 id="insert">
    INSERT
  </h3>
  <button
    id="insert-button"
    @click="doInsert"
  >
    Execute insert
  </button>
  <div id="insert-result">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { insert } = useNeon()

const result = ref('')
async function doInsert() {
  result.value = await insert({
    table: 'playing_with_neon',
    values: { name: 'test', value: '0' },
  }) as string
}
</script>
