<template>
  <h2>Health check probes</h2>
  <div>
    <pre>const { isOk } = useNeonClient()</pre>
    <div
      id="connection"
      style="display: inline"
    >
      {{ connectionOpen }}
    </div>
  </div>
  <div>
    <pre>const { neonStatus } = useNeonClient()</pre>
    <div
      id="status"
      style="display: inline"
    >
      {{ JSON.stringify(dbStatus) }}
    </div>
  </div>

  <h2>SQL Wrappers</h2>
  <BasicSelect />
  <BasicCount />
  <BasicInsert />
  <BasicUpdate />
  <BasicDelete />
  <BasicRaw />
</template>

<script setup lang="ts">
import { useNeonClient } from '#imports'

import BasicCount from '../components/BasicCount.vue'
import BasicDelete from '../components/BasicDelete.vue'
import BasicInsert from '../components/BasicInsert.vue'
import BasicRaw from '../components/BasicRaw.vue'
import BasicSelect from '../components/BasicSelect.vue'
import BasicUpdate from '../components/BasicUpdate.vue'

const { neonStatus, isOk } = useNeonClient()

const dbStatus = await neonStatus()
const connectionOpen = await isOk()
</script>
