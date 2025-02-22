<template>
  <h3>INSERT</h3>
  <div>
    <pre>const { insert } = useNeon()</pre>
  </div>
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
