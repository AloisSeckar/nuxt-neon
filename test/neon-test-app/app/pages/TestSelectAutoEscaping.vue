<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id, name
FROM
  playing_with_neon
WHERE
  name = 'c4ca4238a0' OR name = 'a87ff679a2'
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test auto-escaping values in WHERE clauses

// SELECT
//   id, name
// FROM
//   playing_with_neon
// WHERE
//   name = 'c4ca4238a0' OR name = 'a87ff679a2'
const { data } = await useAsyncData(() => select({
  columns: ['id', 'name'],
  from: 'playing_with_neon',
  where: [
    // test auto-escaping if quotes are added if necessary
    { column: 'name', operator: '=', value: 'c4ca4238a0' },
    // test auto-escaping if quotes are NOT added if not necessary
    { column: 'name', operator: '=', value: '\'a87ff679a2\'', relation: 'OR' },
  ],
}))
</script>
