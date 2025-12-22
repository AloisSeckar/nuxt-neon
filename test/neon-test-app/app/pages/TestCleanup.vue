<template>
  <div style="margin-bottom: 10px;">
    <pre>
DELETE FROM
  playing_with_neon
WHERE
  id > 10
    </pre>
    <button
      id="delete-button"
      @click="doDelete"
    >
      Execute delete
    </button>
    <div id="delete-result">
      {{ result }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { del } = useNeon()

// this is essentially a cleanup after each insert/update test suite run

// DELETE FROM
//   playing_with_neon
// WHERE
//   id > 10

const result = ref('')
async function doDelete() {
  result.value = await del({
    table: 'playing_with_neon',
    where: [{ column: 'id', operator: '>', value: '10' }],
  }) as string
}
</script>
