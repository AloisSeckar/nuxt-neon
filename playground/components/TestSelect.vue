<template>
  <h3>select()</h3>
  <button @click="doSelect">
    Call select
  </button>
  <div>
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
const { select } = useNeon()

const result = ref({})
async function doSelect() {
  result.value = await select(
    ['name', 'value'],
    ['playing_with_neon'],
    ['name LIKE \'test%\''],
    'name DESC',
    2,
  )
}
</script>

  <style>
  .info {
    margin-bottom: 5px;
  }
  </style>
