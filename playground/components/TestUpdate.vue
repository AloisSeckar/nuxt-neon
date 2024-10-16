<template>
  <h3>update()</h3>
  <button @click="doUpdate">
    Execute update
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { neonClient, update } = useNeon()

const result = ref({})
async function doUpdate() {
  result.value = await update(
    neonClient,
    'playing_with_neon',
    { value: '1' },
    ['name = \'test\''],
  )
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
