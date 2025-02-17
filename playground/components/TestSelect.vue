<template>
  <h3>select()</h3>
  <button @click="doSelect">
    Call select
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { select } = useNeon()

const result = ref({})
async function doSelect() {
  result.value = await select(
    ['p1.name AS nname', 'p2.value'],
    [{ table: 'playing_with_neon', alias: 'p1' }, { table: 'playing_with_neon', alias: 'p2', idColumn1: 'p1.name', idColumn2: 'p2.name' }],
    [{ column: 'p1.name', relation: 'LIKE', value: '\'test%\'' }],
    'p1.name DESC',
    2,
  )
}
</script>

  <style>
  .info {
    margin-bottom: 5px;
  }
  </style>
