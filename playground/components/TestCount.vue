<template>
  <h3>COUNT</h3>
  <div>
    <pre>const { count } = useNeon()</pre>
  </div>
  <button @click="doCount">
    Execute count
  </button>
  &nbsp;<pre style="display:inline">(SELECT count(*) FROM playing_with_neon WHERE name LIKE 'test%')</pre>
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
