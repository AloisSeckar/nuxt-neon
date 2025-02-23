<template>
  <h3>SELECT</h3>
  <div>
    <pre>const { select } = useNeon()</pre>
  </div>
  <button @click="doSelect">
    Execute select
  </button>
  &nbsp;<pre style="display:inline">(SELECT id, name, value FROM playing_with_neon WHERE name LIKE 'test%' ORDER BY name DESC)</pre>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { select } = useNeon()

const result = ref({})
async function doSelect() {
  result.value = await select(
    ['id', 'name', 'value'],
    'playing_with_neon',
    [{ column: 'name', condition: 'LIKE', value: '\'test%\'' }],
    [{ column: 'name' }, { column: 'value', direction: 'DESC' }],
    50,
  )
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
