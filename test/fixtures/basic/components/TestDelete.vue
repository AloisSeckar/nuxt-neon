<template>
  <h3 id="delete">
    DELETE
  </h3>
  <button
    id="delete-button"
    @click="doDelete"
  >
    Execute delete
  </button>
  <div id="delete-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { NeonTestData } from '../../types'
import { useNeon } from '#imports'

const { del } = useNeon()

const result = ref([] as NeonTestData[])
async function doDelete() {
  result.value = await del(
    'playing_with_neon',
    [{ column: 'name', condition: '=', value: '\'test\'' }],
  ) as NeonTestData[]
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
