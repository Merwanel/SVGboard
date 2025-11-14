<script setup lang="ts">
import type { AnimationTrack, AnimationType } from '@/types/shapes'

const props = defineProps<{
  track: AnimationTrack
  totalDuration: number
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [trackId: number]
  remove: [trackId: number]
  updateType: [trackId: number, type: AnimationType]
  updateOption: [trackId: number, field: 'freeze' | 'repeat', value: boolean]
  startDrag: [event: MouseEvent, trackId: number]
  startResize: [event: MouseEvent, trackId: number, edge: 'start' | 'end']
}>()

const getTrackStyle = () => {
  const startPercent = (props.track.startTime / props.totalDuration) * 100
  const widthPercent = (props.track.duration / props.totalDuration) * 100
  return {
    left: `${startPercent}%`,
    width: `${widthPercent}%`
  }
}

const getTrackColor = () => {
  const colors = {
    rotate: '#3b82f6',
    scale: '#10b981',
    fade: '#f59e0b',
    translate: '#8b5cf6'
  }
  return colors[props.track.type]
}
</script>

<template>
  <div class="track-wrapper">
    <div class="track-row">
      <div class="track-label">
        <select 
          :value="track.type" 
          @change="emit('updateType', track.id, ($event.target as HTMLSelectElement).value as AnimationType)"
          @click="emit('select', track.id)"
          class="track-type-select"
        >
          <option value="rotate">Rotate</option>
          <option value="scale">Scale</option>
          <option value="fade">Fade</option>
          <option value="translate">Translate</option>
        </select>
        <div class="track-options">
          <button 
            class="mode-toggle"
            @click="emit('updateOption', track.id, 'repeat', !(track.repeat ?? false))"
          >
            {{ track.repeat ? 'Repeat' : 'Freeze' }}
          </button>
        </div>
      </div>
      <div class="track-timeline">
        <div 
          class="track-block"
          :class="{ selected: isSelected }"
          :style="{
            ...getTrackStyle(),
            backgroundColor: getTrackColor()
          }"
          @mousedown="emit('startDrag', $event, track.id)"
          @click="emit('select', track.id)"
        >
          <div 
            class="resize-handle resize-start"
            @mousedown.stop="emit('startResize', $event, track.id, 'start')"
          ></div>
          <span class="track-duration">{{ track.duration.toFixed(1) }}s</span>
          <div 
            class="resize-handle resize-end"
            @mousedown.stop="emit('startResize', $event, track.id, 'end')"
          ></div>
        </div>
      </div>
      <button class="remove-track-btn" @click="emit('remove', track.id)">×</button>
    </div>
  </div>
</template>

<style scoped>
.track-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
}

.track-options {
  display: flex;
  gap: 1rem;
  padding-left: 1px;
  font-size: 0.7rem;
}

.mode-toggle {
  padding: 0.25rem 0.5rem;
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: background 0.2s ease;
  user-select: none;
}

.mode-toggle:hover {
  background: var(--action-color-hover);
}

.track-label {
  width: 100px;
  font-size: 0.75rem;
}

select option {
  margin: 40px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
}

.track-type-select {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
}

.track-timeline {
  flex: 1;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  position: relative;
}

.track-block {
  position: absolute;
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: move;
  transition: opacity 0.2s ease;
}

.track-block:hover {
  opacity: 0.8;
}

.track-block.selected {
  outline: 2px solid white;
  outline-offset: -2px;
}

.track-duration {
  pointer-events: none;
  user-select: none;
}

.resize-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  background: rgba(255, 255, 255, 0.3);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.track-block:hover .resize-handle {
  opacity: 1;
}

.resize-start {
  left: 0;
  border-radius: 4px 0 0 4px;
}

.resize-end {
  right: 0;
  border-radius: 0 4px 4px 0;
}

.remove-track-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  transition: background 0.2s ease;
}

.remove-track-btn:hover {
  background: rgba(255, 0, 0, 0.2);
}
</style>
