<script setup lang="ts">
import { ref } from 'vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import type { Shape } from '@/types/shapes'

const shapes = ref<Shape[]>([])

const handleShapesUpdated = (updatedShapes: Shape[]) => {
  shapes.value = updatedShapes
}
</script>

<template>
  <div class="app">
    <LeftPanel :shapes="shapes" />
    <RightPanel @shapes-updated="handleShapesUpdated" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
</style>
