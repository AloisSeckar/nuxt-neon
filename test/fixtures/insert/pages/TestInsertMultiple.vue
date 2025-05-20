<template>
  <div style="margin-bottom: 10px;">
    <pre>
INSERT INTO
  playing_with_neon (name, value)
VALUES
  ('automatic-test', 111),
  ('automatic-test', 222),
  ('automatic-test', 333)
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

// INSERT with only multiple values (parameter is Record<string, string>[])

// INSERT INTO
//   playing_with_neon (name, value)
// VALUES
//  ('automatic-test', 111),
//  ('automatic-test', 222),
//  ('automatic-test', 333)

const result = ref({})
async function doInsert() {
  result.value = await insert({
    table: 'playing_with_neon',
    values: [
      { name: 'automatic-test', value: '111' },
      { name: 'automatic-test', value: '222' },
      { name: 'automatic-test', value: '333' },
    ],
  })
}
</script>
