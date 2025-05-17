<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id, name, value
FROM
  neon2.playing_with_neon
    </pre>
    <div id="data-7">
      Data 7: {{ data7 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// SELECT
//   id, name, value
// FROM
//   neon2.playing_with_neon
const { data: data7 } = await useAsyncData(() => select(
  // columns
  ['id', 'name', 'value'],
  // test specifying db schema
  { table: 'playing_with_neon', schema: 'neon2' },
))
</script>
