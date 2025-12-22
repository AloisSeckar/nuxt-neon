<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  p1.id, p1.name, p1.value
FROM
  playing_with_neon p1
WHERE
  p1.id > 0
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test single NeonTableObject with an alias (fix #29)
// test single where object (hidden bug until 0.7.1)

// SELECT
//   p1.id, p1.name, p1.value
// FROM
//   playing_with_neon p1
// WHERE
//   p1.id > 0

const { data } = await useAsyncData(() => select({
  columns: [
    { alias: 'p1', name: 'id' },
    { alias: 'p1', name: 'name' },
    { alias: 'p1', name: 'value' },
  ],
  from: { table: 'playing_with_neon', alias: 'p1' },
  where: { column: { alias: 'p1', name: 'value' }, operator: '>', value: '0' },
}))
</script>
