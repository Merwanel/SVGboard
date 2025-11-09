<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Shape, ShapeType, Tool, AnimationTrack } from '@/types/shapes'

const props = defineProps<{
  selectedTool: Tool
  strokeColor: string
  fillColor: string
  initialShapes: Shape[]
}>()

const DRAG_THRESHOLD = 3

const shapes = ref<Shape[]>([...props.initialShapes])
const selectedShape = ref<number | null>(null)
const draggingShape = ref<number | null>(null)
const resizingShape = ref<{ id: number; handle: string } | null>(null)
const dragOffset = ref({ x:-1, y: -1 })
const dragStartPos = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
let nextId = props.initialShapes.length > 0 
  ? Math.max(...props.initialShapes.map(s => s.id)) + 1 
  : 1

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
  shapeSelected: [shapeId: number | null]
}>()

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

const startDrag = (event: MouseEvent, shapeId: number) => {
  event.stopPropagation()
  const shape = shapes.value.find(s => s.id === shapeId)
  if (!shape) return

  selectedShape.value = shapeId
  emit('shapeSelected', shapeId)

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
  if (resizingShape.value) {
    handleResize(event)
    return
  }

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
  // Don't clear selection when stopping drag
  draggingShape.value = null
  resizingShape.value = null
  // Reset hasMoved after a short delay to allow click handler to check it
  setTimeout(() => {
    hasMoved.value = false
  }, 0)
}

const startResize = (event: MouseEvent, shapeId: number, handle: string) => {
  event.stopPropagation()
  resizingShape.value = { id: shapeId, handle }
  dragStartPos.value = {
    x: event.clientX,
    y: event.clientY
  }
}

const handleResize = (event: MouseEvent) => {
  if (!resizingShape.value) return

  const shape = shapes.value.find(s => s.id === resizingShape.value!.id)
  if (!shape) return

  const svg = event.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const handle = resizingShape.value.handle

  if (shape.type === 'rectangle') {
    if (handle.includes('e')) {
      shape.width = Math.max(10, mouseX - shape.x)
    }
    if (handle.includes('w')) {
      const newX = mouseX
      const newWidth = shape.width! + (shape.x - newX)
      if (newWidth > 10) {
        shape.x = newX
        shape.width = newWidth
      }
    }
    if (handle.includes('s')) {
      shape.height = Math.max(10, mouseY - shape.y)
    }
    if (handle.includes('n')) {
      const newY = mouseY
      const newHeight = shape.height! + (shape.y - newY)
      if (newHeight > 10) {
        shape.y = newY
        shape.height = newHeight
      }
    }
  } else if (shape.type === 'circle') {
    const dx = mouseX - shape.x
    const dy = mouseY - shape.y
    shape.radius = Math.max(5, Math.sqrt(dx * dx + dy * dy))
  } else if (shape.type === 'ellipse') {
    if (handle === 'e' || handle === 'w') {
      shape.radiusX = Math.max(5, Math.abs(mouseX - shape.x))
    }
    if (handle === 'n' || handle === 's') {
      shape.radiusY = Math.max(5, Math.abs(mouseY - shape.y))
    }
  }

  emit('shapesUpdated', shapes.value)
}

const getResizeHandles = (shape: Shape) => {
  if (shape.type === 'rectangle') {
    return [
      { handle: 'nw', x: shape.x, y: shape.y },
      { handle: 'n', x: shape.x + shape.width! / 2, y: shape.y },
      { handle: 'ne', x: shape.x + shape.width!, y: shape.y },
      { handle: 'e', x: shape.x + shape.width!, y: shape.y + shape.height! / 2 },
      { handle: 'se', x: shape.x + shape.width!, y: shape.y + shape.height! },
      { handle: 's', x: shape.x + shape.width! / 2, y: shape.y + shape.height! },
      { handle: 'sw', x: shape.x, y: shape.y + shape.height! },
      { handle: 'w', x: shape.x, y: shape.y + shape.height! / 2 }
    ]
  } else if (shape.type === 'circle') {
    return [
      { handle: 'e', x: shape.x + shape.radius!, y: shape.y }
    ]
  } else if (shape.type === 'ellipse') {
    return [
      { handle: 'e', x: shape.x + shape.radiusX!, y: shape.y },
      { handle: 'w', x: shape.x - shape.radiusX!, y: shape.y },
      { handle: 'n', x: shape.x, y: shape.y - shape.radiusY! },
      { handle: 's', x: shape.x, y: shape.y + shape.radiusY! }
    ]
  }
  return []
}

const getAnimationKey = (shapeId: number, trackId: number, track: AnimationTrack) => {
  return `${shapeId}-${trackId}-${track.startTime}-${track.duration}-${JSON.stringify(track.values)}-${track.repeat}-${track.freeze}`
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
      :stroke="shape.stroke"
      :stroke-width="shape.strokeWidth || 2"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
    >
      <template v-if="shape.animations">
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'rotate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="rotate"
          :from="`${track.values.from || 0} ${shape.x + (shape.width || 0) / 2} ${shape.y + (shape.height || 0) / 2}`"
          :to="`${track.values.to || 360} ${shape.x + (shape.width || 0) / 2} ${shape.y + (shape.height || 0) / 2}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'scale')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="scale"
          :from="`${track.values.from || 1}`"
          :to="`${track.values.to || 1.5}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
        <animate
          v-for="track in shape.animations.filter(t => t.type === 'fade')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="opacity"
          :from="`${track.values.from || 1}`"
          :to="`${track.values.to || 0}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
        />
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'translate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="translate"
          :from="`0 0`"
          :to="`${track.values.x || 0} ${track.values.y || 0}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
      </template>
    </rect>
    <circle
      v-for="shape in shapes.filter(s => s.type === 'circle')"
      :key="shape.id"
      :cx="shape.x"
      :cy="shape.y"
      :r="shape.radius"
      :fill="shape.fill"
      :stroke="shape.stroke"
      :stroke-width="shape.strokeWidth || 2"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
    >
      <template v-if="shape.animations">
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'rotate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="rotate"
          :from="`${track.values.from || 0} ${shape.x} ${shape.y}`"
          :to="`${track.values.to || 360} ${shape.x} ${shape.y}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'scale')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="scale"
          :from="`${track.values.from || 1}`"
          :to="`${track.values.to || 1.5}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
        <animate
          v-for="track in shape.animations.filter(t => t.type === 'fade')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="opacity"
          :from="`${track.values.from || 1}`"
          :to="`${track.values.to || 0}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
        />
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'translate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="translate"
          :from="`0 0`"
          :to="`${track.values.x || 0} ${track.values.y || 0}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
      </template>
    </circle>
    <line
      v-for="shape in shapes.filter(s => s.type === 'line')"
      :key="shape.id"
      :x1="shape.x"
      :y1="shape.y"
      :x2="shape.x2"
      :y2="shape.y2"
      :stroke="shape.stroke || '#42b983'"
      :stroke-width="shape.strokeWidth || 3"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
    />
    <ellipse
      v-for="shape in shapes.filter(s => s.type === 'ellipse')"
      :key="shape.id"
      :cx="shape.x"
      :cy="shape.y"
      :rx="shape.radiusX"
      :ry="shape.radiusY"
      :fill="shape.fill"
      :stroke="shape.stroke"
      :stroke-width="shape.strokeWidth || 2"
      class="shape"
      @mousedown="startDrag($event, shape.id)"
    >
      <template v-if="shape.animations">
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'rotate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="rotate"
          :from="`${track.values.from || 0} ${shape.x} ${shape.y}`"
          :to="`${track.values.to || 360} ${shape.x} ${shape.y}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'scale')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="scale"
          :from="`${track.values.from || 1}`"
          :to="`${track.values.to || 1.5}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
        <animate
          v-for="track in shape.animations.filter(t => t.type === 'fade')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="opacity"
          :from="`${track.values.from || 1}`"
          :to="`${track.values.to || 0}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
        />
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'translate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="translate"
          :from="`0 0`"
          :to="`${track.values.x || 0} ${track.values.y || 0}`"
          :begin="`${track.startTime}s`"
          :dur="`${track.duration}s`"
          :repeatCount="track.repeat ? 'indefinite' : '1'"
          :fill="track.freeze ?? true ? 'freeze' : 'remove'"
          additive="sum"
        />
      </template>
    </ellipse>

    <g v-if="selectedShape !== null">
      <template v-for="shape in shapes.filter(s => s.id === selectedShape)" :key="`handles-${shape.id}`">
        <circle
          v-for="handle in getResizeHandles(shape)"
          :key="`${shape.id}-${handle.handle}`"
          :cx="handle.x"
          :cy="handle.y"
          r="5"
          fill="white"
          stroke="var(--action-color)"
          stroke-width="2"
          class="resize-handle"
          @mousedown.stop="startResize($event, shape.id, handle.handle)"
        />
      </template>
    </g>
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
    cursor: cell;
  }
}

.shape:hover {
  opacity: 0.8;
}

.resize-handle {
  cursor: nwse-resize;
  &:hover {
    r: 6;
  }
}
</style>
