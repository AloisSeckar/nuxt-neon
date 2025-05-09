<template>
  <h3>INSERT</h3>
  <div>
    <pre>const { insert } = useNeon()</pre>
  </div>
  <button @click="doInsert">
    Execute insert
  </button>
  &nbsp;<pre style="display:inline">(INSERT INTO playing_with_neon (name, value) VALUES ('test', '0'))</pre>
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
    { name: 'test', value: '0' },
  )
}
</script>

<style>
.info {
margin-bottom: 5px;
}
</style>
