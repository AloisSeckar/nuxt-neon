<template>
  <h3>UPDATE</h3>
  <div>
    <pre>const { update } = useNeon()</pre>
  </div>
  <button @click="doUpdate">
    Execute update
  </button>
  &nbsp;<pre style="display:inline">(UPDATE playing_with_neon SET value = '1' WHERE name = 'test')</pre>
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
    [{ column: 'name', condition: '=', value: 'test' }],
  )
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
