<template>
  <h3>UPDATE</h3>
  <div>
    <pre>const { update } = useNeonClient()</pre>
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
import { ref, useNeonClient } from '#imports'

const { update } = useNeonClient()

const result = ref({})
async function doUpdate() {
  result.value = await update({
    table: 'playing_with_neon',
    values: { value: '1' },
    where: [{ column: 'name', operator: '=', value: 'test' }],
  })
}
</script>
