<script setup lang="ts">
import DrawingToolbar from './DrawingToolbar.vue'
import type { Shape } from '@/types/shapes'

const props = defineProps<{
  shapes: Shape[]
}>()

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
}>()

const handleShapesUpdated = (shapes: Shape[]) => {
  emit('shapesUpdated', shapes)
}
</script>

<template>
  <div class="right-panel">
    <DrawingToolbar :shapes="shapes" @shapes-updated="handleShapesUpdated" />
  </div>
</template>

<style scoped>
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  overflow: hidden;
  transition: background-color 0.3s ease;
}
</style>
