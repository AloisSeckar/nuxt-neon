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
    <div id="data-6">
      Data 6: {{ data6 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// SELECT
//   id
// FROM
//   playing_with_neon
// WHERE
//   id > 5
// ORDER BY
//   id DESC
const { data: data6 } = await useAsyncData(() => select(
  // test string value (select single column)
  'id',
  // test string value (single table)
  'playing_with_neon',
  // test single-clause WHERE
  { column: 'id', condition: '>', value: '5' },
  // test single-clause ORDER BY
  { column: 'id', direction: 'DESC' },
))
</script>
