<template>
  <div style="margin-bottom: 10px;">
    <pre>
UPDATE
  neon2.playing_with_neon as p1
SET
  value = 200
WHERE
  p1.id = '11'
    </pre>
    <div id="update-result">
      {{ result }}
    </div>
    <button
      id="update-button"
      @click="doUpdate"
    >
      Execute update
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { update } = useNeon()

// UPDATE with
// this test relies on TestInsertSchema that inserts the value with given id

// UPDATE
//   neon2.playing_with_neon as p1
// SET
//   value = 200
// HERE
//   p1.id = '11'

const result = ref({})
async function doUpdate() {
  result.value = await update(
    // table
    { schema: 'neon2', table: 'playing_with_neon', alias: 'p1' },
    // values
    { value: '200' },
    // where
    { alias: 'p1', column: 'value', condition: '=', value: '11' },
  )
}
</script>
