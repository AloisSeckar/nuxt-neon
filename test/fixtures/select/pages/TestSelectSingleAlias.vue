<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value
FROM
  playing_with_neon p1
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test single NeonTableQuery with an alias (fix #29)

// SELECT
//   p1.id, p1.name, p1.value
// FROM
//   playing_with_neon p1

const { data } = await useAsyncData(() => select({
  columns: [
    { alias: 'p1', name: 'id' },
    { alias: 'p1', name: 'name' },
    { alias: 'p1', name: 'value' },
  ],
  from: { table: 'playing_with_neon', alias: 'p1' },
}))
</script>
