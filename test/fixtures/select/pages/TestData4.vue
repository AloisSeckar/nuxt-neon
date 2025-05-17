<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text, p3.bool_value
FROM
  playing_with_neon p1
  JOIN playing_with_neon_2 p2 ON p1.id = p2.id
  JOIN playing_with_neon_3 p3 ON p2.value_bool = p3.bool_key
WHERE
  p2.value_bool = true
    </pre>
    <div id="data-4">
      Data 4: {{ data4 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// SELECT
//   p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
// FROM
//   playing_with_neon p1
//   JOIN playing_with_neon_2 p2 ON p1.id = p2.id
//   JOIN playing_with_neon_3 p3 ON p2.value_bool = p3.bool_key
// WHERE
//   p2.value_bool = true
const { data: data4 } = await useAsyncData(() => select(
  [
    { alias: 'p1', name: 'id' },
    { alias: 'p1', name: 'name' },
    { alias: 'p1', name: 'value' },
    { alias: 'p2', name: 'value_int' },
    { alias: 'p2', name: 'value_bool' },
    { alias: 'p2', name: 'value_text' },
    { alias: 'p3', name: 'bool_value' },
  ],
  [
    { table: 'playing_with_neon', alias: 'p1' },
    { table: 'playing_with_neon_2', alias: 'p2', joinColumn1: 'p1.id', joinColumn2: 'p2.id' },
    { table: 'playing_with_neon_3', alias: 'p3', joinColumn1: 'p2.value_bool', joinColumn2: 'p3.bool_key' },
  ],
  [
    { column: 'p2.value_bool', condition: '=', value: 'true' },
  ],
))
</script>
