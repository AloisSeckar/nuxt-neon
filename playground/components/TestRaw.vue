<template>
  <h3>raw()</h3>
  <button @click="doRaw">
    Execute raw query
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { raw } = useNeon()

const result = ref({})
async function doRaw() {
  result.value = await raw(
    'SELECT 1=1',
  )
}
</script>

<style>
.info {
    margin-bottom: 5px;
}
</style>
