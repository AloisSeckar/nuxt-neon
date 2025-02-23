<template>
  <h1>Nuxt-Neon TEST</h1>
  <div id="connection">
    Connection: {{ connection }}
  </div>
  <div id="status">
    Status: {{ status }}
  </div>
  <TestRaw />
  <TestSelect />
  <TestInsert />
  <TestUpdate />
  <TestDelete />
</template>

<script setup lang="ts">
import TestDelete from './components/TestDelete.vue'
import TestInsert from './components/TestInsert.vue'
import TestRaw from './components/TestRaw.vue'
import TestSelect from './components/TestSelect.vue'
import TestUpdate from './components/TestUpdate.vue'
import { useNeon } from '#imports'

const { isOk, neonStatus } = useNeon()
const connection = await isOk()
const status = await neonStatus(false)
</script>
