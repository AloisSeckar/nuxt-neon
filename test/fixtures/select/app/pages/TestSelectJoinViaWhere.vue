<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p2.value_int, p3.bool_value
FROM
  neon2.playing_with_neon p1,
  playing_with_neon_2 p2,
  playing_with_neon_3 p3
WHERE
  p1.id = p2.id
  AND p2.value_bool = p3.bool_key
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// testing "join tables w/o JOIN (#28)"

// SELECT
//   p1.id, p1.name, p2.value_int, p3.bool_value
// FROM
//   neon2.playing_with_neon p1,
//   playing_with_neon_2 p2,
//   playing_with_neon_3 p3
// WHERE
//   p1.id = p2.id
//   AND p2.value_bool = p3.bool_key

const { data } = await useAsyncData(() => select({
  columns: [
    { alias: 'p1', name: 'id' },
    { alias: 'p1', name: 'name' },
    { alias: 'p2', name: 'value_int' },
    { alias: 'p3', name: 'bool_value' },
  ],
  from: [
    { schema: 'neon2', table: 'playing_with_neon', alias: 'p1' },
    { table: 'playing_with_neon_2', alias: 'p2' },
    { table: 'playing_with_neon_3', alias: 'p3' },
  ],
  where: 'p1.id = p2.id AND p2.value_bool = p3.bool_key',
}))
</script>
