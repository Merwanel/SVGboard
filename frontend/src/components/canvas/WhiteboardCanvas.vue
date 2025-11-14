<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Shape, ShapeType, Tool } from '@/types/shapes'
import { useShapeInteractions } from '@/composables/useShapeInteractions'
import ShapeRenderer from './ShapeRenderer.vue'
import ResizeHandles from './ResizeHandles.vue'

const props = defineProps<{
  selectedTool: Tool
  strokeColor: string
  fillColor: string
  initialShapes: Shape[]
}>()

const shapes = ref<Shape[]>([...props.initialShapes])
const selectedShape = ref<number | null>(null)
let nextId = props.initialShapes.length > 0 
  ? Math.max(...props.initialShapes.map(s => s.id)) + 1 
  : 1

const selectedShapeObject = computed(() => 
  shapes.value.find(s => s.id === selectedShape.value) ?? null
)

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
  shapeSelected: [shapeId: number | null]
}>()

const { hasMoved, startDrag, handleDrag, stopDrag, startResize } = useShapeInteractions(
  () => shapes.value,
  (updatedShapes) => emit('shapesUpdated', updatedShapes)
)

watch(() => props.initialShapes, (newShapes) => {
  shapes.value = [...newShapes]
  if (newShapes.length > 0) {
    nextId = Math.max(...newShapes.map(s => s.id)) + 1
  }
}, { deep: true })

const handleCanvasClick = (event: MouseEvent) => {
  // Only handle clicks directly on the canvas background, not on shapes
  if (event.target !== event.currentTarget) {
    return
  }
  
  // Ignore clicks that were actually drag operations 
  // (click seems to trigger after mouseup)
  if (hasMoved.value) {
    hasMoved.value = false
    return 
  }
  if (props.selectedTool === 'select') {
    selectedShape.value = null
    emit('shapeSelected', null)
    return
  }

  const svg = event.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const newShape: Shape = {
    id: nextId++,
    type: props.selectedTool as ShapeType,
    x,
    y,
    fill: props.fillColor,
    stroke: props.strokeColor
  }

  if (props.selectedTool === 'rectangle') {
    newShape.width = 100
    newShape.height = 60
  } else if (props.selectedTool === 'circle') {
    newShape.radius = 40
  } else if (props.selectedTool === 'line') {
    newShape.x2 = x + 100
    newShape.y2 = y
  } else if (props.selectedTool === 'ellipse') {
    newShape.radiusX = 60
    newShape.radiusY = 40
  }

  shapes.value.push(newShape)
  emit('shapesUpdated', shapes.value)
}

const handleShapeDrag = (event: MouseEvent, shapeId: number) => {
  selectedShape.value = shapeId
  emit('shapeSelected', shapeId)
  startDrag(event, shapeId)
}


</script>

<template>
  <svg 
    class="canvas"
    @click="handleCanvasClick"
    @mousemove="handleDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <g
      v-for="shape in shapes"
      :key="shape.id"
      @mousedown="handleShapeDrag($event, shape.id)"
    >
      <ShapeRenderer :shape="shape" />
    </g>

    <ResizeHandles
      v-if="selectedShapeObject"
      :key="`handles-${selectedShapeObject.id}`"
      :shape="selectedShapeObject"
      @start-resize="startResize"
    />
  </svg>
</template>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  cursor: crosshair;
  transition: background-color 0.3s ease;
}


</style>
