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
import { ref, useNeon } from '#imports'

const { insert } = useNeon()

const result = ref({})
async function doInsert() {
  result.value = await insert({
    table: 'playing_with_neon',
    values: { name: 'test', value: '0' },
  })
}
</script>
