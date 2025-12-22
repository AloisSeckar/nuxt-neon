<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id
FROM
  playing_with_neon
WHERE
  id > 5
ORDER BY
  id DESC
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test single values

// SELECT
//   id
// FROM
//   playing_with_neon
// WHERE
//   id > 5
// ORDER BY
//   id DESC

const { data } = await useAsyncData(() => select({
  columns: ['id'],
  from: 'playing_with_neon',
  where: [{ column: 'id', operator: '>', value: '5' }],
  order: [{ column: 'id', direction: 'DESC' }],
}))
</script>
