<script setup lang="ts">
import type { Shape } from '@/types/shapes'

const props = defineProps<{
  shape: Shape
}>()

const emit = defineEmits<{
  startResize: [event: MouseEvent, shapeId: number, handle: string]
}>()

const getResizeHandles = () => {
  if (props.shape.type === 'rectangle') {
    return [
      { handle: 'nw', x: props.shape.x, y: props.shape.y },
      { handle: 'n', x: props.shape.x + props.shape.width! / 2, y: props.shape.y },
      { handle: 'ne', x: props.shape.x + props.shape.width!, y: props.shape.y },
      { handle: 'e', x: props.shape.x + props.shape.width!, y: props.shape.y + props.shape.height! / 2 },
      { handle: 'se', x: props.shape.x + props.shape.width!, y: props.shape.y + props.shape.height! },
      { handle: 's', x: props.shape.x + props.shape.width! / 2, y: props.shape.y + props.shape.height! },
      { handle: 'sw', x: props.shape.x, y: props.shape.y + props.shape.height! },
      { handle: 'w', x: props.shape.x, y: props.shape.y + props.shape.height! / 2 }
    ]
  } else if (props.shape.type === 'circle') {
    return [
      { handle: 'e', x: props.shape.x + props.shape.radius!, y: props.shape.y }
    ]
  } else if (props.shape.type === 'ellipse') {
    return [
      { handle: 'e', x: props.shape.x + props.shape.radiusX!, y: props.shape.y },
      { handle: 'w', x: props.shape.x - props.shape.radiusX!, y: props.shape.y },
      { handle: 'n', x: props.shape.x, y: props.shape.y - props.shape.radiusY! },
      { handle: 's', x: props.shape.x, y: props.shape.y + props.shape.radiusY! }
    ]
  }
  return []
}
</script>

<template>
  <g>
    <circle
      v-for="handle in getResizeHandles()"
      :key="`${shape.id}-${handle.handle}`"
      :cx="handle.x"
      :cy="handle.y"
      r="5"
      fill="white"
      stroke="var(--action-color)"
      stroke-width="2"
      class="resize-handle"
      @mousedown.stop="emit('startResize', $event, shape.id, handle.handle)"
    />
  </g>
</template>

<style scoped>
.resize-handle {
  cursor: nwse-resize;
  &:hover {
    r: 6;
  }
}
</style>
