<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id
FROM
  playing_with_neon
WHERE
  id BETWEEN 2 AND 8
  AND
  id IN (3,5,7)
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test IN and BETWEEN operators

// SELECT
//   id
// FROM
//   playing_with_neon
// WHERE
//   id BETWEEN 2 AND 8
//   AND
//   id IN (3,5,7)

const { data } = await useAsyncData(() => select({
  columns: ['id'],
  from: 'playing_with_neon',
  where: [
    { column: 'id', operator: 'BETWEEN', value: '2,8' },
    { column: 'id', operator: 'IN', value: '3,5,7', relation: 'AND' },
  ],
}))
</script>
