<template>
  <h3 id="group">
    SELECT with GROUP BY + HAVING
  </h3>
  <div>
    <pre>const { select } = useNeonClient()</pre>
  </div>
  <button
    id="group-button"
    @click="doSelect"
  >
    Execute select with group by + having
  </button>
  &nbsp;<pre style="display:inline">(SELECT value, count(id) FROM playing_with_neon GROUP BY value HAVING value >= 1 ORDER BY value DESC)</pre>
  <div id="group-result">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeonClient } from '#imports'

const { select } = useNeonClient()

const result = ref({})
async function doSelect() {
  result.value = await select({
    columns: ['value', 'count(id)'],
    from: 'playing_with_neon',
    order: { column: 'value', direction: 'DESC' },
    group: ['value'],
    having: { column: 'value', operator: '>=', value: '1' },
  })
}
</script>
