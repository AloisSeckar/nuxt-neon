<template>
  <h3 id="delete">
    DELETE
  </h3>
  <button
    id="delete-button"
    @click="doDelete"
  >
    Execute delete
  </button>
  <div id="delete-data">
    Result: {{ result }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNeon } from '#imports'

const { del } = useNeon()

const result = ref('')
async function doDelete() {
  result.value = await del({
    table: 'playing_with_neon',
    where: [{ column: 'name', condition: 'LIKE', value: '\'%test%\'' }],
  }) as string
}
</script>
