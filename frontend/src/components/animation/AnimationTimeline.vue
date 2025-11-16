<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { AnimationType, AnimationTrack } from '@/types/shapes'
import { useTrackDragResize } from '@/composables/useTrackDragResize'
import TimelineControls from './TimelineControls.vue'
import TimelineTrackItem from './TimelineTrackItem.vue'
import TimelineTrackEditor from './TimelineTrackEditor.vue'
import TimelineGrid from './TimelineGrid.vue'

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
const isCollapsed = ref(false)

const { startDrag, startResize } = useTrackDragResize(
  () => props.tracks,
  () => localTotalDuration.value,
  (tracks) => emit('updateTracks', tracks)
)

watch(() => props.totalDuration, (newDuration) => {
  localTotalDuration.value = newDuration || 5
})

const addTrack = () => {
  const newTrack: AnimationTrack = {
    id: nextTrackId.value++,
    type: 'rotate',
    startTime: 0,
    duration: 2,
    values: { from: 0, to: 360 },
    freeze: true,
    repeat: false
  }
  emit('updateTracks', [...props.tracks, newTrack])
}

const removeTrack = (trackId: number) => {
  emit('updateTracks', props.tracks.filter(t => t.id !== trackId))
}

const updateDuration = (duration: number) => {
  localTotalDuration.value = duration
  emit('updateTotalDuration', duration)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const selectedTrack = computed(() => {
  return props.tracks.find(t => t.id === selectedTrackId.value)
})

const selectTrack = (trackId: number) => {
  selectedTrackId.value = trackId
}

const handleUpdateTrackType = (trackId: number, type: AnimationType) => {
  selectedTrackId.value = trackId
  const updatedTracks = props.tracks.map(t => {
    if (t.id === trackId) {
      const defaultValues = getDefaultValues(type)
      return { ...t, type, values: defaultValues }
    }
    return t
  })
  emit('updateTracks', updatedTracks)
}

const updateTrackType = (type: AnimationType) => {
  if (!selectedTrack.value) return
  handleUpdateTrackType(selectedTrack.value.id, type)
}

const updateTrackValues = (key: string, value: number) => {
  if (!selectedTrack.value) return
  const updatedTracks = props.tracks.map(t => {
    if (t.id === selectedTrackId.value) {
      return { ...t, values: { ...t.values, [key]: value } }
    }
    return t
  })
  emit('updateTracks', updatedTracks)
}

const updateTrackOption = (trackId: number, field: 'freeze' | 'repeat', value: boolean) => {
  const updatedTracks = props.tracks.map(t => {
    if (t.id === trackId) {
      return { ...t, [field]: value }
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
</script>

<template>
  <div class="animation-timeline" :class="{ collapsed: isCollapsed }">
    <div class="timeline-header">
      <h3>Animation Timeline</h3>
      <button class="collapse-toggle" @click="toggleCollapse" :title="isCollapsed ? 'Expand' : 'Collapse'">
        {{ isCollapsed ? '▲' : '▼' }}
      </button>
    </div>

    <div v-if="!isCollapsed">
      <div v-if="selectedShapeId === null" class="no-selection">
        Select a shape to add animations
      </div>

    <div v-if="selectedShapeId !== null" class="timeline-content">
      <TimelineControls 
        :total-duration="localTotalDuration"
        @update-duration="updateDuration"
        @add-track="addTrack"
      />

      <div class="timeline-container">
        <div class="timeline-grid">
          <div class="tracks">
            <TimelineTrackItem
              v-for="track in tracks"
              :key="track.id"
              :track="track"
              :total-duration="localTotalDuration"
              :is-selected="selectedTrackId === track.id"
              @select="selectTrack"
              @remove="removeTrack"
              @update-type="handleUpdateTrackType"
              @update-option="updateTrackOption"
              @start-drag="startDrag"
              @start-resize="startResize"
            />

            <div v-if="tracks.length === 0" class="empty-tracks">
              No animations yet. Click "+ Add Track" to start.
            </div>
          </div>

        <TimelineGrid :total-duration="localTotalDuration" />
      </div>

      <TimelineTrackEditor
        v-if="selectedTrack"
        :track="selectedTrack"
        @update-type="updateTrackType"
        @update-values="updateTrackValues"
        @remove="removeTrack(selectedTrack.id)"
      />
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.animation-timeline {
  padding: 1rem;
  background: var(--bg-secondary);
  transition: all 0.3s ease;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

:root[data-theme="light"] .animation-timeline {
  background: rgba(245, 245, 245, 0.92);
}

:root[data-theme="dark"] .animation-timeline {
  background: rgba(45, 45, 45, 0.92);
}

:root[data-theme="solar"] .animation-timeline {
  background: rgba(238, 232, 213, 0.92);
}

.animation-timeline.collapsed {
  padding: 0.5rem 1rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.animation-timeline.collapsed .timeline-header {
  margin-bottom: 0;
}

h3 {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.collapse-toggle {
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-toggle:hover {
  background: var(--action-color-hover);
}

.no-selection {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}



.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-grid {
  flex: 1;
  position: relative;
}

.tracks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 100px;
}



.empty-tracks {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}




</style>
