<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  id
FROM
  playing_with_neon
WHERE
  id > 5
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeonClient } from '#imports'

const { raw } = useNeonClient()

// test disallowed raw SQL query being passed to raw endpoint
// query should fail at validation

// SELECT
//   id
// FROM
//   playing_with_neon
// WHERE
//   id > 5

const { data } = await useAsyncData(() => raw('SELECT id FROM playing_with_neon WHERE id > 5'))
</script>
