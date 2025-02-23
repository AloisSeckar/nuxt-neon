<template>
  <h3>COUNT (select count(*) from)</h3>
  <div>
    <pre>const { count } = useNeon()</pre>
  </div>
  <button @click="doCount">
    Execute count
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { count } = useNeon()

const result = ref({})
async function doCount() {
  result.value = await count(
    'playing_with_neon',
    [{ column: 'name', condition: 'LIKE', value: '\'test%\'' }],
  )
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
