<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id, name, value
FROM
  neon2.playing_with_neon
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeonClient } from '#imports'

const { select } = useNeonClient()

// test select using DB schema

// SELECT
//   id, name, value
// FROM
//   neon2.playing_with_neon

const { data } = await useAsyncData(() => select({
  columns: ['id', 'name', 'value'],
  from: { table: 'playing_with_neon', schema: 'neon2' },
}))
</script>
