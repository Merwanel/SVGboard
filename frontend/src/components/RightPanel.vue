<script setup lang="ts">
import { ref } from 'vue'
import DrawingToolbar from './DrawingToolbar.vue'
import WhiteboardCanvas from './WhiteboardCanvas.vue'
import type { Shape } from '@/types/shapes'

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
}>()

const canvasRef = ref<InstanceType<typeof WhiteboardCanvas> | null>(null)

const handleToolSelected = (tool: 'rectangle' | 'circle' | 'line' | null) => {
  if (canvasRef.value) {
    canvasRef.value.selectedTool = tool
  }
}

const handleShapesUpdated = (shapes: Shape[]) => {
  emit('shapesUpdated', shapes)
}
</script>

<template>
  <div class="right-panel">
    <DrawingToolbar @tool-selected="handleToolSelected" />
    <WhiteboardCanvas ref="canvasRef" @shapes-updated="handleShapesUpdated" />
  </div>
</template>

<style scoped>
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
}
</style>
