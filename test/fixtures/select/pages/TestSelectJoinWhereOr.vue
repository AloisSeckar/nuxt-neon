<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
FROM
  playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
WHERE
  p1.value > 0.5 OR p2.value_bool = true
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// simple JOIN of two tables via ID
// with WHERE w1 OR w2

// SELECT
//   p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
// FROM
//   playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
// WHERE
//   p1.value > 0.5 OR p2.value_bool = true
const { data } = await useAsyncData(() => select(
  // columns
  [
    'p1.id', 'p1.name', 'p1.value', 'p2.value_int', 'p2.value_bool', 'p2.value_text',
  ],
  // from
  [
    { table: 'playing_with_neon', alias: 'p1' },
    { table: 'playing_with_neon_2', alias: 'p2', joinColumn1: 'p1.id', joinColumn2: 'p2.id' },
  ],
  // where
  [
    { alias: 'p1', column: 'value', condition: '>', value: '0.5' },
    { alias: 'p2', column: 'value_bool', condition: '=', value: 'true', operator: 'OR' },
  ],
))
</script>
