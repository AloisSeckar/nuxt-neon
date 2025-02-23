<template>
  <h3>DELETE</h3>
  <div>
    <pre>const { del } = useNeon()</pre>
  </div>
  <button @click="doDelete">
    Execute delete
  </button>
  &nbsp;<pre style="display:inline">(DELETE FROM playing_with_neon WHERE name = 'test')</pre>
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
