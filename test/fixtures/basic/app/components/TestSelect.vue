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
import type { NeonTestData } from '../../../types'
import { useNeon } from '#imports'

const { select } = useNeon()

const result = ref([] as NeonTestData[])
async function doSelect() {
  result.value = await select<NeonTestData>({
    columns: ['id', 'name', 'value'],
    from: 'playing_with_neon',
    where: [{ column: 'name', condition: 'LIKE', value: '\'test%\'' }],
    order: [{ column: 'name' }, { column: 'value', direction: 'DESC' }],
    limit: 50,
  }) as NeonTestData[]
}
</script>
