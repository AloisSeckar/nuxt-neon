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
const { del } = useNeon()

const result = ref({})
async function doDelete() {
  result.value = await del(
    'playing_with_neon',
    [{ column: 'name', condition: '=', value: '\'test\'' }],
  )
}
</script>

  <style>
  .info {
    margin-bottom: 5px;
  }
  </style>
