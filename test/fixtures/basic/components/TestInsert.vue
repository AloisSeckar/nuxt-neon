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
  <div id="insert-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { insert } = useNeon()

const result = ref({})
async function doInsert() {
  result.value = await insert(
    'playing_with_neon',
    ['test', '0'],
    ['name', 'value'],
  ) as [] // TODO proper typing
}
</script>

<style>
.info {
margin-bottom: 5px;
}
</style>
