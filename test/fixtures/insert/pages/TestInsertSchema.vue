<template>
  <div style="margin-bottom: 10px;">
    <pre>
INSERT INTO
  neon2.playing_with_neon (id, name, value)
VALUES
  ('automatic-test', 231)
    </pre>
    <div id="insert-result">
      {{ result }}
    </div>
    <button
      id="insert-button"
      @click="doInsert"
    >
      Execute insert
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { insert } = useNeon()

// INSERT with schema defined
// (alias is not allowed in insert)

// INSERT INTO
//   neon2.playing_with_neon (id, name, value)
// VALUES
//   (11, 'automatic-test', 100)

const result = ref({})
async function doInsert() {
  result.value = await insert({
    table: { schema: 'neon2', table: 'playing_with_neon' },
    values: { id: '11', name: 'automatic-test', value: '231' },
  })
}
</script>
