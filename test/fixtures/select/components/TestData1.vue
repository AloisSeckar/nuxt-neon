<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
FROM
  playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
    </pre>
    <div id="data-1">
      Data 1: {{ data1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// SELECT
//   p1.id, p1.name, p1.value, p2.value_int, p2.value_bool, p2.value_text
// FROM
//   playing_with_neon p1 JOIN playing_with_neon_2 p2 ON p1.id = p2.id
const { data: data1 } = await useAsyncData(() => select(
  ['p1.id', 'p1.name', 'p1.value', 'p2.value_int', 'p2.value_bool', 'p2.value_text'],
  [
    { table: 'playing_with_neon', alias: 'p1' },
    { table: 'playing_with_neon_2', alias: 'p2', joinColumn1: 'p1.id', joinColumn2: 'p2.id' },
  ],
))
</script>
