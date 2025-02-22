<template>
  <h3 id="raw">
    Raw SQL Queries
  </h3>
  <button
    id="raw-button"
    @click="doRaw"
  >
    Execute
  </button>
  <div id="raw-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { raw } = useNeon()

const result = ref({})
async function doRaw() {
  result.value = await raw(
    'SELECT id, name, value AS custom_value FROM playing_with_neon',
  ) as [] // TODO proper typing
}
</script>

<style>
.info {
    margin-bottom: 5px;
}
</style>
