<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id, value, count(id)
FROM
  playing_with_neon
GROUP BY
  id, value
HAVING
  value >= 0.9
ORDER BY
  value DESC
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeonClient } from '#imports'

const { select } = useNeonClient()

// test simple GROUP BY + HAVING clause
// + extra test count(col)

// SELECT
//   id, value, count(id)
// FROM
//   playing_with_neon
// GROUP BY
//   id, value
// HAVING
//   value >= 0.9
// ORDER BY
//   value DESC

const { data } = await useAsyncData(() => select({
  columns: ['id', 'value', 'count(id)'],
  from: 'playing_with_neon',
  group: ['id', 'value'],
  having: { column: 'value', operator: '>=', value: '0.9' },
  order: { column: 'value', direction: 'DESC' },
}))
</script>
