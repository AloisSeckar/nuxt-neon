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
    <div id="data-5">
      Data 5: {{ data5 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// SELECT
//   id, name
// FROM
//   playing_with_neon
// WHERE
//   name = 'c4ca4238a0' OR name = 'a87ff679a2'
const { data: data5 } = await useAsyncData(() => select(
  ['id', 'name'],
  'playing_with_neon',
  [
    // test auto-escaping if quotes are added if necessary
    { column: 'name', condition: '=', value: 'c4ca4238a0' },
    // test auto-escaping if quotes are NOT added if not necessary
    { column: 'name', condition: '=', value: '\'a87ff679a2\'', operator: 'OR' },
  ],
))
</script>
