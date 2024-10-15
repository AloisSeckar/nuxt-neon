<template>
  <h3>insert()</h3>
  <div v-if="status === 'pending'">
    Fetching data...
  </div>
  <div v-if="data">
    <strong>Neon data:</strong><br>{{ data }}
  </div>
  <div v-if="error">
    <strong>Failed to fetch data</strong>
  </div>
</template>

<script setup lang="ts">
const { neonClient, insert } = useNeon()
const { data, status, error } = await useAsyncData(() => {
  return insert(
    neonClient,
    ['name', 'value'],
    ['playing_with_neon'],
    ['name LIKE \'c%\''],
    'name DESC',
    2,
  )
})
</script>

<style>
.info {
margin-bottom: 5px;
}
</style>
