<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  oid
FROM
  pg_database
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeonClient } from '#imports'

const { select } = useNeonClient()

// test reading from pg_* table (not allowed by default)
// query should fail at validation

// SELECT
//   oid
// FROM
//   pg_database
const { data } = await useAsyncData(() => select({
  columns: 'oid',
  from: 'pg_database',
}))
</script>
