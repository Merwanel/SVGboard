<script setup lang="ts">
import DrawingToolbar from './DrawingToolbar.vue'
import type { Shape } from '@/types/shapes'

defineProps<{
  shapes: Shape[]
}>()

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
  shapeSelected: [shapeId: number | null]
}>()

const handleShapesUpdated = (shapes: Shape[]) => {
  emit('shapesUpdated', shapes)
}

const handleShapeSelected = (shapeId: number | null) => {
  emit('shapeSelected', shapeId)
}
</script>

<template>
  <div class="right-panel">
    <DrawingToolbar 
      :shapes="shapes" 
      @shapes-updated="handleShapesUpdated"
      @shape-selected="handleShapeSelected"
    />
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
