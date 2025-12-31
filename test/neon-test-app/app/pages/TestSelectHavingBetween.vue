<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value
FROM
  playing_with_neon p1
GROUP BY
  p1.id, p1.name, p1.value
HAVING
  p1.value BETWEEN 0.5 AND 0.7
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeonClient } from '#imports'

const { select } = useNeonClient()

// test HAVING clause being trated same as WHERE clauses
// with specific behvior for BETWEEN operator

// SELECT
//   p1.id, p1.name, p1.value
// FROM
//   playing_with_neon p1
// GROUP BY
//   p1.id, p1.name, p1.value
// HAVING
//   p1.value BETWEEN 0.5 AND 0.7

const { data } = await useAsyncData(() => select({
  columns: [
    'p1.id', 'p1.name', 'p1.value',
  ],
  from: [
    { table: 'playing_with_neon', alias: 'p1' },
  ],
  group: [
    'p1.id', 'p1.name', 'p1.value',
  ],
  having: [
    { column: { alias: 'p1', name: 'value' }, operator: 'BETWEEN', value: '0.5,0.7' },
  ],
}))
</script>
