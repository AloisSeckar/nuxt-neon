<template>
  <h3>COUNT</h3>
  <div>
    <pre>const { count } = useNeonClient()</pre>
  </div>
  <button @click="doCount">
    Execute count
  </button>
  &nbsp;<pre style="display:inline">(SELECT count(*) FROM playing_with_neon WHERE name LIKE 'test%')</pre>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref, useNeonClient } from '#imports'

const { count } = useNeonClient()

const result = ref({})
async function doCount() {
  result.value = await count({
    from: 'playing_with_neon',
    where: [{ column: 'name', operator: 'LIKE', value: 'test%' }],
  })
}
</script>
