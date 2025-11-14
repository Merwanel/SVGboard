<script setup lang="ts">
import type { Shape, AnimationTrack } from '@/types/shapes'

defineProps<{
  shape: Shape
}>()

const getAnimationKey = (shapeId: number, trackId: number, track: AnimationTrack) => {
  return `${shapeId}-${trackId}-${track.startTime}-${track.duration}-${JSON.stringify(track.values)}-${track.repeat}-${track.freeze}`
}

const getRotateCenter = (shape: Shape) => {
  if (shape.type === 'rectangle') {
    return `${shape.x + (shape.width || 0) / 2} ${shape.y + (shape.height || 0) / 2}`
  }
  return `${shape.x} ${shape.y}`
}
</script>

<template>
  <g>
    <rect
      v-if="shape.type === 'rectangle'"
      :x="shape.x"
      :y="shape.y"
      :width="shape.width"
      :height="shape.height"
      :fill="shape.fill"
      :stroke="shape.stroke"
      :stroke-width="shape.strokeWidth || 2"
      class="shape"
    >
      <template v-if="shape.animations">
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'rotate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="rotate"
          :from="`${track.values.from || 0} ${getRotateCenter(shape)}`"
          :to="`${track.values.to || 360} ${getRotateCenter(shape)}`"
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
      v-else-if="shape.type === 'circle'"
      :cx="shape.x"
      :cy="shape.y"
      :r="shape.radius"
      :fill="shape.fill"
      :stroke="shape.stroke"
      :stroke-width="shape.strokeWidth || 2"
      class="shape"
    >
      <template v-if="shape.animations">
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'rotate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="rotate"
          :from="`${track.values.from || 0} ${getRotateCenter(shape)}`"
          :to="`${track.values.to || 360} ${getRotateCenter(shape)}`"
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
      v-else-if="shape.type === 'line'"
      :x1="shape.x"
      :y1="shape.y"
      :x2="shape.x2"
      :y2="shape.y2"
      :stroke="shape.stroke || '#42b983'"
      :stroke-width="shape.strokeWidth || 3"
      class="shape"
    />

    <ellipse
      v-else-if="shape.type === 'ellipse'"
      :cx="shape.x"
      :cy="shape.y"
      :rx="shape.radiusX"
      :ry="shape.radiusY"
      :fill="shape.fill"
      :stroke="shape.stroke"
      :stroke-width="shape.strokeWidth || 2"
      class="shape"
    >
      <template v-if="shape.animations">
        <animateTransform
          v-for="track in shape.animations.filter(t => t.type === 'rotate')"
          :key="getAnimationKey(shape.id, track.id, track)"
          attributeName="transform"
          type="rotate"
          :from="`${track.values.from || 0} ${getRotateCenter(shape)}`"
          :to="`${track.values.to || 360} ${getRotateCenter(shape)}`"
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
  </g>
</template>

<style scoped>
.shape {
  cursor: move;
  &:active {
    cursor: cell;
  }
}

.shape:hover {
  opacity: 0.8;
}
</style>
