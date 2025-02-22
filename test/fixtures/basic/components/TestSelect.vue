<template>
  <h3 id="select">
    SELECT
  </h3>
  <button
    id="select-button"
    @click="doSelect"
  >
    Execute
  </button>
  <div id="select-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { NeonTestData } from '../../types'
import { useNeon } from '#imports'

const { select } = useNeon()

const result = ref([] as NeonTestData[])
async function doSelect() {
  result.value = await select(
    ['id', 'name', 'value'],
    'playing_with_neon',
    [{ column: 'name', condition: 'LIKE', value: '\'test%\'' }],
    [{ column: 'name' }, { column: 'value', direction: 'DESC' }],
    50,
  ) as NeonTestData[]
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
