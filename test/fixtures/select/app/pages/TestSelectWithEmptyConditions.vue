<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id
FROM
  playing_with_neon
-- NO WHERE
-- NO ORDER BY
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test handling empty [] in WHERE and ORDER BY

// SELECT
//   id
// FROM
//   playing_with_neon
// -- NO WHERE
// -- NO ORDER BY

const { data } = await useAsyncData(() => select({
  columns: ['id'],
  from: 'playing_with_neon',
  where: [],
  order: [],
}))
</script>
