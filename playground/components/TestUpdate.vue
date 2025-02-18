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
const { update } = useNeon()

const result = ref({})
async function doUpdate() {
  result.value = await update(
    'playing_with_neon',
    { value: '1' },
    [{ column: 'name', condition: '=', value: '\'test\'' }],
  )
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
