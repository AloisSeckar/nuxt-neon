<template>
  <div style="margin-bottom: 10px;">
    <pre>
DELETE FROM
  neon2.playing_with_neon p1
WHERE
  p1.id > 10
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

// this tests deleting with schema and alias defined
// it also cleanups after related insert/update test suite runs

// DELETE FROM
//   neon2.playing_with_neon p1
// WHERE
//   p1.id > 10

const result = ref('')
async function doDelete() {
  result.value = await del(
    // delete from
    { schema: 'neon2', table: 'playing_with_neon', alias: 'p1' },
    // where
    { alias: 'p1', column: 'id', condition: '>', value: '10' },
  ) as string
}
</script>
