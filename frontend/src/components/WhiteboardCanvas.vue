<script setup lang="ts">
import { ref } from 'vue'
import type { Shape, ShapeType } from '@/types/shapes'

const props = defineProps<{
  selectedTool: ShapeType | null
}>()

const DRAG_THRESHOLD = 3

const shapes = ref<Shape[]>([])
const draggingShape = ref<number | null>(null)
const dragOffset = ref({ x:-1, y: -1 })
const dragStartPos = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
let nextId = 1

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
}>()

const handleCanvasClick = (event: MouseEvent) => {
  // Ignore clicks that were actually drag operations 
  // (click seems to trigger after mouseup)
  if (hasMoved.value) {
    hasMoved.value = false
    return 
  }
  if (!props.selectedTool) return

  const svg = event.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const newShape: Shape = {
    id: nextId++,
    type: props.selectedTool,
    x,
    y,
    fill: '#42b983'
  }

  if (props.selectedTool === 'rectangle') {
    newShape.width = 100
    newShape.height = 60
  } else if (props.selectedTool === 'circle') {
    newShape.radius = 40
  } else if (props.selectedTool === 'line') {
    newShape.x2 = x + 100
    newShape.y2 = y
  }

  shapes.value.push(newShape)
  emit('shapesUpdated', shapes.value)
}

const startDrag = (event: MouseEvent, shapeId: number) => {
  event.stopPropagation()
  const shape = shapes.value.find(s => s.id === shapeId)
  if (!shape) return

  const svg = (event.currentTarget as SVGElement).ownerSVGElement || (event.currentTarget as SVGElement)
  const rect = svg.getBoundingClientRect()

  draggingShape.value = shapeId
  dragOffset.value = {
    x: event.clientX - rect.left - shape.x,
    y: event.clientY - rect.top - shape.y
  }
  dragStartPos.value = {
    x: event.clientX,
    y: event.clientY
  }
  hasMoved.value = false
}

const handleDrag = (event: MouseEvent) => {
  if (draggingShape.value === null) return

  const shape = shapes.value.find(s => s.id === draggingShape.value)
  if (!shape) return

  const dx = Math.abs(event.clientX - dragStartPos.value.x)
  const dy = Math.abs(event.clientY - dragStartPos.value.y)
  if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
    hasMoved.value = true
  }

  const svg = (event.currentTarget as SVGElement)
  const rect = svg.getBoundingClientRect()
  
  
  shape.x = event.clientX - rect.left - dragOffset.value.x
  shape.y = event.clientY - rect.top - dragOffset.value.y

  if (shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
    const dx = shape.x2 - (event.clientX - rect.left - dragOffset.value.x)
    const dy = shape.y2 - (event.clientY - rect.top - dragOffset.value.y)
    shape.x2 = shape.x + dx
    shape.y2 = shape.y + dy
  }

  emit('shapesUpdated', shapes.value)
}

const stopDrag = () => {
  draggingShape.value = null
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
    <rect 
      v-for="shape in shapes.filter(s => s.type === 'rectangle')"
      :key="shape.id"
      :x="shape.x"
      :y="shape.y"
      :width="shape.width"
      :height="shape.height"
      :fill="shape.fill"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
    />
    <circle
      v-for="shape in shapes.filter(s => s.type === 'circle')"
      :key="shape.id"
      :cx="shape.x"
      :cy="shape.y"
      :r="shape.radius"
      :fill="shape.fill"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
    />
    <line
      v-for="shape in shapes.filter(s => s.type === 'line')"
      :key="shape.id"
      :x1="shape.x"
      :y1="shape.y"
      :x2="shape.x2"
      :y2="shape.y2"
      stroke="#42b983"
      stroke-width="3"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
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

.shape {
  cursor: move;
  &:active {
    cursor: cell  ;
  }
}

.shape:hover {
  opacity: 0.8;
}
</style>
