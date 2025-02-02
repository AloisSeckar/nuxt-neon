<template>
  <h3>insert()</h3>
  <button @click="doInsert">
    Execute insert
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { insert } = useNeon()

const result = ref({})
async function doInsert() {
  result.value = await insert(
    'playing_with_neon',
    ['test', '0'],
    ['name', 'value'],
  )
}
</script>

<style>
.info {
margin-bottom: 5px;
}
</style>
