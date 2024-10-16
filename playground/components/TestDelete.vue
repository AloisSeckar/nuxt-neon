<template>
  <h3>delete()</h3>
  <button @click="doDelete">
    Execute delete
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { neonClient, del } = useNeon()

const result = ref({})
async function doDelete() {
  result.value = await del(
    neonClient,
    'playing_with_neon',
    ['name = \'test\''],
  )
}
</script>

  <style>
  .info {
    margin-bottom: 5px;
  }
  </style>
