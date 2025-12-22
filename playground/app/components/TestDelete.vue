<template>
  <h3>DELETE</h3>
  <div>
    <pre>const { del } = useNeon()</pre>
  </div>
  <button @click="doDelete">
    Execute delete
  </button>
  &nbsp;<pre style="display:inline">(DELETE FROM playing_with_neon WHERE name = 'test')</pre>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref, useNeon } from '#imports'

const { del } = useNeon()

const result = ref({})
async function doDelete() {
  result.value = await del({
    table: 'playing_with_neon',
    where: [{ column: 'name', operator: '=', value: 'test' }],
  })
}
</script>
