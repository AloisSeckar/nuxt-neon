<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id
FROM
  playing_with_neon
WHERE
  id > 5 OR 1=1
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test simple SQL injection attempt
// query should fail at validation

// SELECT
//   id
// FROM
//   playing_with_neon
// WHERE
//   id > 5 OR 1=1

const { data } = await useAsyncData(() => select({
  columns: ['id'],
  from: 'playing_with_neon',
  where: [{ column: 'id', operator: '>', value: '5 OR 1=1' }],
}))
</script>
