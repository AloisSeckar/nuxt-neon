<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
FROM
  playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
ORDER BY
  p1.id DESC, p2.value_int DESC
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
// using NeonColumnObject to define joining columns
// with ORDER BY on two columns

// SELECT
//   p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
// FROM
//   playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
// ORDER BY
//   p1.id DESC, p2.value_int ASC

const { data } = await useAsyncData(() => select({
  columns: [
    'p1.id', 'p1.name', 'p1.value', 'p2.value_int', 'p2.value_bool', 'p2.value_text',
  ],
  from: [
    { table: 'playing_with_neon', alias: 'p1' },
    { table: 'playing_with_neon_2', alias: 'p2', joinColumn1: { alias: 'p1', name: 'id' }, joinColumn2: { alias: 'p2', name: 'id' } },
  ],
  order: [
    { column: { alias: 'p1', name: 'id' }, direction: 'DESC' },
    { column: { alias: 'p2', name: 'value_int' }, direction: 'desc' }, // test lowercase 'desc'
  ],
}))
</script>
