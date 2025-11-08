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

      <div class="timeline-grid">
        <div class="tracks">
          <div 
            v-for="track in tracks" 
            :key="track.id"
            class="track-row"
          >
            <div class="track-label">
              {{ track.type }}
            </div>
            <div class="track-timeline">
              <div 
                class="track-block"
                :style="{
                  ...getTrackStyle(track),
                  backgroundColor: getTrackColor(track.type)
                }"
              >
                <span class="track-duration">{{ track.duration }}s</span>
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

.timeline-grid {
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
  width: 80px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: capitalize;
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

.track-duration {
  pointer-events: none;
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
</style>
