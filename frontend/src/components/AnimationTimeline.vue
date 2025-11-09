<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AnimationType, AnimationTrack } from '@/types/shapes'

const props = defineProps<{
  selectedShapeId: number | null
  tracks: AnimationTrack[]
  totalDuration: number
}>()

const emit = defineEmits<{
  updateTracks: [tracks: AnimationTrack[]]
  updateTotalDuration: [duration: number]
}>()

const localTotalDuration = ref(props.totalDuration || 5)
const nextTrackId = ref(1)
const selectedTrackId = ref<number | null>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const dragStartX = ref(0)
const dragStartTime = ref(0)
const resizeEdge = ref<'start' | 'end' | null>(null)

const timeMarkers = computed(() => {
  const markers = []
  for (let i = 0; i <= localTotalDuration.value; i++) {
    markers.push(i)
  }
  return markers
})

const getTrackStyle = (track: AnimationTrack) => {
  const startPercent = (track.startTime / localTotalDuration.value) * 100
  const widthPercent = (track.duration / localTotalDuration.value) * 100
  return {
    left: `${startPercent}%`,
    width: `${widthPercent}%`
  }
}

const getTrackColor = (type: AnimationType) => {
  const colors = {
    rotate: '#3b82f6',
    scale: '#10b981',
    fade: '#f59e0b',
    translate: '#8b5cf6'
  }
  return colors[type]
}

const addTrack = () => {
  const newTrack: AnimationTrack = {
    id: nextTrackId.value++,
    type: 'rotate',
    startTime: 0,
    duration: 2,
    values: { from: 0, to: 360 }
  }
  emit('updateTracks', [...props.tracks, newTrack])
}

const removeTrack = (trackId: number) => {
  emit('updateTracks', props.tracks.filter(t => t.id !== trackId))
}

const updateDuration = () => {
  emit('updateTotalDuration', localTotalDuration.value)
}

const selectedTrack = computed(() => {
  return props.tracks.find(t => t.id === selectedTrackId.value)
})

const selectTrack = (trackId: number) => {
  selectedTrackId.value = trackId
}

const updateTrackType = (type: AnimationType) => {
  if (!selectedTrack.value) return
  const updatedTracks = props.tracks.map(t => {
    if (t.id === selectedTrackId.value) {
      const defaultValues = getDefaultValues(type)
      return { ...t, type, values: defaultValues }
    }
    return t
  })
  emit('updateTracks', updatedTracks)
}



const getDefaultValues = (type: AnimationType) => {
  const defaults = {
    rotate: { from: 0, to: 360 },
    scale: { from: 1, to: 1.5 },
    fade: { from: 1, to: 0 },
    translate: { x: 0, y: 100 }
  }
  return defaults[type]
}

const startDrag = (event: MouseEvent, trackId: number) => {
  const track = props.tracks.find(t => t.id === trackId)
  if (!track) return

  isDragging.value = true
  selectedTrackId.value = trackId
  dragStartX.value = event.clientX
  dragStartTime.value = track.startTime

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value || !selectedTrackId.value) return

  const track = props.tracks.find(t => t.id === selectedTrackId.value)
  if (!track) return

  const timeline = document.querySelector('.track-timeline')
  if (!timeline) return

  const rect = timeline.getBoundingClientRect()
  const deltaX = event.clientX - dragStartX.value
  const deltaTime = (deltaX / rect.width) * localTotalDuration.value

  let newStartTime = dragStartTime.value + deltaTime
  newStartTime = Math.max(0, Math.min(newStartTime, localTotalDuration.value - track.duration))

  const updatedTracks = props.tracks.map(t => {
    if (t.id === selectedTrackId.value) {
      return { ...t, startTime: newStartTime }
    }
    return t
  })
  emit('updateTracks', updatedTracks)
}

const stopDrag = () => {
  isDragging.value = false
  isResizing.value = false
  resizeEdge.value = null
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mousemove', handleResize)
}

const startResize = (event: MouseEvent, trackId: number, edge: 'start' | 'end') => {
  event.stopPropagation()
  const track = props.tracks.find(t => t.id === trackId)
  if (!track) return

  isResizing.value = true
  selectedTrackId.value = trackId
  resizeEdge.value = edge
  dragStartX.value = event.clientX
  dragStartTime.value = edge === 'start' ? track.startTime : track.startTime + track.duration

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopDrag)
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing.value || !selectedTrackId.value || !resizeEdge.value) return

  const track = props.tracks.find(t => t.id === selectedTrackId.value)
  if (!track) return

  const timeline = document.querySelector('.track-timeline')
  if (!timeline) return

  const rect = timeline.getBoundingClientRect()
  const deltaX = event.clientX - dragStartX.value
  const deltaTime = (deltaX / rect.width) * localTotalDuration.value

  const updatedTracks = props.tracks.map(t => {
    if (t.id === selectedTrackId.value) {
      if (resizeEdge.value === 'start') {
        let newStartTime = dragStartTime.value + deltaTime
        newStartTime = Math.max(0, Math.min(newStartTime, t.startTime + t.duration - 0.5))
        const newDuration = t.duration + (t.startTime - newStartTime)
        return { ...t, startTime: newStartTime, duration: newDuration }
      } else {
        let newEndTime = dragStartTime.value + deltaTime
        newEndTime = Math.max(t.startTime + 0.5, Math.min(newEndTime, localTotalDuration.value))
        const newDuration = newEndTime - t.startTime
        return { ...t, duration: newDuration }
      }
    }
    return t
  })
  emit('updateTracks', updatedTracks)
}
</script>

<template>
  <div class="animation-timeline">
    <div class="timeline-header">
      <h3>Animation Timeline</h3>
      <div v-if="selectedShapeId === null" class="no-selection">
        Select a shape to add animations
      </div>
    </div>

    <div v-if="selectedShapeId !== null" class="timeline-content">
      <div class="timeline-controls">
        <label>
          Total Duration:
          <input 
            type="number" 
            v-model.number="localTotalDuration"
            @change="updateDuration"
            min="1"
            max="30"
            step="1"
          />s
        </label>
        <button class="add-track-btn" @click="addTrack">+ Add Track</button>
      </div>

      <div class="timeline-container">
        <div class="timeline-grid">
          <div class="tracks">
          <div 
            v-for="track in tracks" 
            :key="track.id"
            class="track-row"
          >
            <div class="track-label">
              <select 
                :value="track.type" 
                @change="updateTrackType(($event.target as HTMLSelectElement).value as AnimationType)"
                @click="selectTrack(track.id)"
                class="track-type-select"
              >
                <option value="rotate">Rotate</option>
                <option value="scale">Scale</option>
                <option value="fade">Fade</option>
                <option value="translate">Translate</option>
              </select>
            </div>
            <div class="track-timeline">
              <div 
                class="track-block"
                :class="{ selected: selectedTrackId === track.id }"
                :style="{
                  ...getTrackStyle(track),
                  backgroundColor: getTrackColor(track.type)
                }"
                @mousedown="startDrag($event, track.id)"
                @click="selectTrack(track.id)"
              >
                <div 
                  class="resize-handle resize-start"
                  @mousedown.stop="startResize($event, track.id, 'start')"
                ></div>
                <span class="track-duration">{{ track.duration.toFixed(1) }}s</span>
                <div 
                  class="resize-handle resize-end"
                  @mousedown.stop="startResize($event, track.id, 'end')"
                ></div>
              </div>
            </div>
            <button class="remove-track-btn" @click="removeTrack(track.id)">×</button>
          </div>

          <div v-if="tracks.length === 0" class="empty-tracks">
            No animations yet. Click "+ Add Track" to start.
          </div>
        </div>

        <div class="time-markers">
          <div 
            v-for="marker in timeMarkers" 
            :key="marker"
            class="time-marker"
            :style="{ left: `${(marker / localTotalDuration) * 100}%` }"
          >
            {{ marker }}s
          </div>
        </div>
      </div>

      <div v-if="selectedTrack" class="track-editor">
          <h4>Edit Animation</h4>
          <p class="wip-message">WIP</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animation-timeline {
  padding: 1rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.timeline-header {
  margin-bottom: 1rem;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.no-selection {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.timeline-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.timeline-controls label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline-controls input[type="number"] {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.add-track-btn {
  padding: 0.5rem 1rem;
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-track-btn:hover {
  background: var(--action-color-hover);
}

.timeline-container {
  display: flex;
  gap: 1rem;
}

.timeline-grid {
  flex: 1;
  position: relative;
}

.tracks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 100px;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
}

.track-label {
  width: 100px;
  font-size: 0.75rem;
}

.track-type-select {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.75rem;
  cursor: pointer;
}

.track-timeline {
  flex: 1;
  height: 100%;
  background: var(--bg-primary);
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

.empty-tracks {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.time-markers {
  position: relative;
  height: 20px;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.time-marker {
  position: absolute;
  top: 0;
  font-size: 0.625rem;
  color: var(--text-secondary);
  transform: translateX(-50%);
}

.track-editor {
  width: 200px;
  padding: 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.track-editor h4 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.editor-field {
  margin-bottom: 0.75rem;
}

.editor-field label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.editor-field select,
.editor-field input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.wip-message {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-style: italic;
}
</style>
