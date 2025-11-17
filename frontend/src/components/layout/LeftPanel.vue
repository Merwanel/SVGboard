<script setup lang="ts">
import { ref } from 'vue'
import CodeView from './CodeView.vue'
import ProjectList from '@/components/project/ProjectList.vue';
import AnimationTimeline from '@/components/animation/AnimationTimeline.vue'
import type { Shape, AnimationTrack } from '@/types/shapes'

const props = defineProps<{
  shapes: Shape[]
  currentProjectId: number | null
  selectedShapeId: number | null
}>()

const emit = defineEmits<{
  openProject: [projectId: number]
  editProject: [projectId: number, newTitle: string]
  deleteProject: [projectId: number]
  createProject: [title: string]
  restoreSnapshot: [snapshotId: number, shapesData: string]
  updateShapes: [shapes: Shape[]]
}>()

const isCollapsed = ref(false)
const activeView = ref<'code' | 'history' | 'animation'>('code')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const setView = (view: 'code' | 'history' | 'animation') => {
  activeView.value = view
}

defineExpose({
  setView
})

const handleOpenProject = (projectId: number) => {
  emit('openProject', projectId)
}

const handleEditProject = (projectId: number, newTitle: string) => {
  emit('editProject', projectId, newTitle)
}

const handleDeleteProject = (projectId: number) => {
  emit('deleteProject', projectId)
}

const handleCreateProject = (title: string) => {
  emit('createProject', title)
}

const handleRestoreSnapshot = (snapshotId: number, shapesData: string) => {
  emit('restoreSnapshot', snapshotId, shapesData)
}

const getCurrentTracks = (): AnimationTrack[] => {
  if (props.selectedShapeId === null) return []
  const shape = props.shapes.find(s => s.id === props.selectedShapeId)
  return shape?.animations || []
}

const getCurrentTotalDuration = (): number => {
  if (props.selectedShapeId === null) return 5
  const shape = props.shapes.find(s => s.id === props.selectedShapeId)
  return shape?.totalDuration || 5
}

const handleUpdateTracks = (tracks: AnimationTrack[]) => {
  if (props.selectedShapeId === null) return
  const updatedShapes = props.shapes.map((s: Shape) => {
    if (s.id === props.selectedShapeId) {
      return { ...s, animations: tracks }
    }
    return s
  })
  emit('updateShapes', updatedShapes)
}

const handleUpdateTotalDuration = (duration: number) => {
  if (props.selectedShapeId === null) return
  const updatedShapes = props.shapes.map((s: Shape) => {
    if (s.id === props.selectedShapeId) {
      const trimmedTracks = (s.animations || []).map(track => {
        const trackEnd = track.startTime + track.duration
        if (trackEnd > duration) {
          const newDuration = duration - track.startTime
          return { ...track, duration: newDuration }
        }
        return track
      }).filter(track => track.duration > 0)
      return { ...s, totalDuration: duration, animations: trimmedTracks }
    }
    return s
  })
  emit('updateShapes', updatedShapes)
}
</script>

<template>
  <div class="left-panel" :class="{ collapsed: isCollapsed }">
    <div class="panel-content">
      <div class="tabs">
        <button 
          class="tab"
          :class="{ active: activeView === 'code' }"
          @click="setView('code')"
        >
          Code
        </button>
        <button 
          class="tab"
          :class="{ active: activeView === 'history' }"
          @click="setView('history')"
        >
          History
        </button>
        <button 
          class="tab"
          :class="{ active: activeView === 'animation' }"
          @click="setView('animation')"
        >
          Animation
        </button>
      </div>
      <div class="view-content">
        <CodeView v-if="activeView === 'code'" :shapes="shapes" />
        <ProjectList
          v-else-if="activeView === 'history'"
          @open-project="handleOpenProject"
          @edit-project="handleEditProject"
          @delete-project="handleDeleteProject"
          @create-project="handleCreateProject"
          @restore-snapshot="handleRestoreSnapshot"
        />
        <AnimationTimeline
          v-else-if="activeView === 'animation'"
          :selected-shape-id="selectedShapeId"
          :tracks="getCurrentTracks()"
          :total-duration="getCurrentTotalDuration()"
          @update-tracks="handleUpdateTracks"
          @update-total-duration="handleUpdateTotalDuration"
        />
      </div>
    </div>
    <button class="collapse-btn" @click="toggleCollapse">
      {{ isCollapsed ? '→' : '←' }}
    </button>
  </div>
</template>

<style scoped>
.left-panel {
  position: relative;
  width: 400px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease, background-color 0.3s ease;
  overflow: hidden;
}

.left-panel.collapsed {
  width: 50px;
}

.panel-content {
  padding: 1rem;
  opacity: 1;
  transition: opacity 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.left-panel.collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.tab {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--action-color);
}

.tab.active {
  color: var(--action-color);
  border-bottom-color: var(--action-color);
  font-weight: 600;
}

.view-content {
  flex: 1;
  overflow: auto;
}



.collapse-btn {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.collapse-btn:hover {
  background: var(--action-color-hover);
}
</style>
