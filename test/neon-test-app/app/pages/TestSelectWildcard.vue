<template>
  <div style="margin-bottom: 10px;">
    <pre>
SELECT
  *
FROM
  playing_with_neon
    </pre>
    <div id="data">
      {{ data }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncData, useNeon } from '#imports'

const { select } = useNeon()

// test wildcard selection (all columns)

// SELECT
//   *
// FROM
//   playing_with_neon

const { data } = await useAsyncData(() => select({
  columns: ['*'],
  from: 'playing_with_neon',
}))
</script>
