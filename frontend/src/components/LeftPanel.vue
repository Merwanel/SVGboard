<script setup lang="ts">
import { ref } from 'vue'
import CodeView from './CodeView.vue'
import HistoryView from './HistoryView.vue'
import SvgPreview from './SvgPreview.vue' // TODO: delete
import type { Shape } from '@/types/shapes'

defineProps<{
  shapes: Shape[]
  projectId: number | null
}>()

const emit = defineEmits<{
  restore: [snapshotId: number, shapesData: string]
}>()

const isCollapsed = ref(false)
const activeView = ref<'code' | 'history' | 'browser'>('code')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const setView = (view: 'code' | 'history' | 'browser') => {
  activeView.value = view
}

const handleRestore = (snapshotId: number, shapesData: string) => {
  emit('restore', snapshotId, shapesData)
}

// TODO: delete
const testShapesData = JSON.stringify([
  { id: 1, type: 'rectangle', x: 50, y: 50, width: 150, height: 100, fill: '#ff6b6b' },
  { id: 2, type: 'circle', x: 300, y: 150, radius: 60, fill: '#4ecdc4' },
  { id: 3, type: 'ellipse', x: 500, y: 200, radiusX: 80, radiusY: 40, fill: '#45b7d1' },
  { id: 4, type: 'line', x: 100, y: 400, x2: 400, y2: 500, fill: '#f9ca24' }
])
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
          :class="{ active: activeView === 'browser' }"
          @click="setView('browser')"
        >
          Browser
        </button>
      </div>
      <div class="view-content">
        <CodeView v-if="activeView === 'code'" :shapes="shapes" />
        <HistoryView 
          v-else-if="activeView === 'history'" 
          :project-id="projectId"
          @restore="handleRestore"
        />
        <div v-else class="placeholder">
          <p>browser</p>
          <!-- TODO: delete -->
          <div style="margin-top: 2rem;">
            <h3 style="margin-bottom: 1rem;">Large Preview:</h3>
            <SvgPreview :shapes-data="testShapesData" size="large" />
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Small Preview:</h3>
            <SvgPreview :shapes-data="testShapesData" size="small" />
            
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Empty Preview:</h3>
            <SvgPreview shapes-data="" size="large" />
          </div>
        </div>
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
  color: #42b983;
}

.tab.active {
  color: #42b983;
  border-bottom-color: #42b983;
  font-weight: 600;
}

.view-content {
  flex: 1;
  overflow: auto;
}

.placeholder {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.collapse-btn {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  background: #42b983;
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
  background: #35a372;
}
</style>
