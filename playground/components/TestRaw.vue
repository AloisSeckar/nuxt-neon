<template>
  <h3>Raw SQL Queries</h3>
  <div>
    <pre>const { raw } = useNeon()</pre>
  </div>
  <button @click="doRaw">
    Execute raw query
  </button>
  &nbsp;<pre style="display:inline">(SELECT 1=1 AS test)</pre>
  <div>
    Result: {{ result }}
  </div>
  <div style="color: orange">
    <strong>Warning:</strong> This method is potentially unsafe with custom user inputs
  </div>
</template>

<script setup lang="ts">
import { ref, useNeon } from '#imports'

const { raw } = useNeon()

const result = ref({})
async function doRaw() {
  result.value = await raw(
    'SELECT 1=1 AS test',
  )
}
</script>

<style>
.info {
    margin-bottom: 5px;
}
</style>
