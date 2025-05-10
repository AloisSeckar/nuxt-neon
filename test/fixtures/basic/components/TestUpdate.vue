<template>
  <h3 id="update">
    UPDATE
  </h3>
  <button
    id="update-button"
    @click="doUpdate"
  >
    Execute update
  </button>
  <div id="update-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { update } = useNeon()

const result = ref('')
async function doUpdate() {
  result.value = await update(
    'playing_with_neon',
    { value: '1' },
    [{ column: 'name', condition: '=', value: '\'test\'' }],
  ) as string
}
</script>

<style>
.info {
  margin-bottom: 5px;
}
</style>
