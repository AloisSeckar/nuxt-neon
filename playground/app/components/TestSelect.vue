<template>
  <h3>SELECT</h3>
  <div>
    <pre>const { select } = useNeon()</pre>
  </div>
  <button @click="doSelect">
    Execute select
  </button>
  &nbsp;<pre style="display:inline">(SELECT id, name, value FROM playing_with_neon WHERE name LIKE 'test%' ORDER BY name DESC LIMIT 10)</pre>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref, useNeon } from '#imports'

const { select } = useNeon()

const result = ref({})
async function doSelect() {
  result.value = await select({
    columns: ['id', 'name', 'value'],
    from: 'playing_with_neon',
    where: [{ column: 'name', operator: 'LIKE', value: 'test%' }],
    order: [{ column: 'name' }, { column: 'value', direction: 'DESC' }],
    limit: 10,
  })
}
</script>
