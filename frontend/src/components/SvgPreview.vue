<script setup lang="ts">
import { computed } from 'vue'
import type { Shape } from '@/types/shapes'

interface Props {
  shapesData: string
  size?: 'small' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large'
})

const shapes = computed<Shape[]>(() => {
  if (!props.shapesData || props.shapesData.trim() === '') {
    return []
  }

  try {
    const parsed = JSON.parse(props.shapesData)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Failed to parse shapes data:', error)
    return []
  }
})

const viewBox = computed(() => {
  return '0 0 800 600'
})
</script>

<template>
  <div class="svg-preview" :class="`svg-preview--${size}`">
    <svg
      v-if="shapes.length > 0"
      :viewBox="viewBox"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <template v-for="shape in shapes" :key="shape.id">
        <rect
          v-if="shape.type === 'rectangle'"
          :x="shape.x"
          :y="shape.y"
          :width="shape.width"
          :height="shape.height"
          :fill="shape.fill"
          :stroke="shape.stroke"
          :stroke-width="shape.strokeWidth"
        />
        <circle
          v-else-if="shape.type === 'circle'"
          :cx="shape.x"
          :cy="shape.y"
          :r="shape.radius"
          :fill="shape.fill"
          :stroke="shape.stroke"
          :stroke-width="shape.strokeWidth"
        />
        <ellipse
          v-else-if="shape.type === 'ellipse'"
          :cx="shape.x"
          :cy="shape.y"
          :rx="shape.radiusX"
          :ry="shape.radiusY"
          :fill="shape.fill"
          :stroke="shape.stroke"
          :stroke-width="shape.strokeWidth"
        />
        <line
          v-else-if="shape.type === 'line'"
          :x1="shape.x"
          :y1="shape.y"
          :x2="shape.x2"
          :y2="shape.y2"
          :stroke="shape.stroke || shape.fill"
          :stroke-width="shape.strokeWidth || 2"
        />
      </template>
    </svg>
    <div v-else class="svg-preview__empty">
      <span>Empty</span>
    </div>
  </div>
</template>

<style scoped>
.svg-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.svg-preview--large {
  width: 150px;
  height: 100px;
}

.svg-preview--small {
  width: 80px;
  height: 60px;
}

.svg-preview svg {
  width: 100%;
  height: 100%;
}

.svg-preview__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #999;
  font-size: 12px;
}
</style>
