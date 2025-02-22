<template>
  <h3>SELECT</h3>
  <div>
    <pre>const { select } = useNeon()</pre>
  </div>
  <button @click="doSelect">
    Execute select
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
    [{ table: 'playing_with_neon', alias: 'p1' }, { table: 'playing_with_neon', alias: 'p2', joinColumn1: 'p1.name', joinColumn2: 'p2.name' }],
    [{ column: 'p1.name', condition: 'LIKE', value: '\'test%\'' }],
    [{ column: 'p1.name' }, { column: 'p1.value', direction: 'DESC' }],
    50,
  )
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
