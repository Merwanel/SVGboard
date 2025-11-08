<script setup lang="ts">
import { ref } from 'vue'
import CodeView from './CodeView.vue'
import ProjectList from './ProjectList.vue'
import type { Shape } from '@/types/shapes'

defineProps<{
  shapes: Shape[]
}>()

const emit = defineEmits<{
  openProject: [projectId: number]
  deleteProject: [projectId: number]
  createProject: [title: string]
}>()

const isCollapsed = ref(false)
const activeView = ref<'code' | 'history'>('code')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const setView = (view: 'code' | 'history') => {
  activeView.value = view
}

const handleOpenProject = (projectId: number) => {
  emit('openProject', projectId)
}

const handleDeleteProject = (projectId: number) => {
  emit('deleteProject', projectId)
}

const handleCreateProject = (title: string) => {
  emit('createProject', title)
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
          history
        </button>
      </div>
      <div class="view-content">
        <CodeView v-if="activeView === 'code'" :shapes="shapes" />
        <ProjectList
          v-else
          @open-project="handleOpenProject"
          @delete-project="handleDeleteProject"
          @create-project="handleCreateProject"
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
