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
  <TestCount />
  <TestInsert />
  <TestUpdate />
  <TestGroupByHaving />
  <TestDelete />
</template>

<script setup lang="ts">
import TestCount from './components/TestCount.vue'
import TestDelete from './components/TestDelete.vue'
import TestGroupByHaving from './components/TestGroupByHaving.vue'
import TestInsert from './components/TestInsert.vue'
import TestRaw from './components/TestRaw.vue'
import TestSelect from './components/TestSelect.vue'
import TestUpdate from './components/TestUpdate.vue'
import { useNeon } from '#imports'

const { isOk, neonStatus } = useNeon()
const connection = await isOk()
const status = await neonStatus(false)
</script>
