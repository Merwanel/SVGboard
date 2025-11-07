<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import SaveStatusIndicator from './components/SaveStatusIndicator.vue'
import Theme from './components/Theme.vue'
import { useProjects } from '@/composables/useProjects'
import type { Shape } from '@/types/shapes'
import type { ProjectResponse } from './types/api'

const shapes = ref<Shape[]>([])
const currentProjectId = ref<number | null>(null)
const hasUnsavedChanges = ref(false)

const { createProject } = useProjects()

// TODO: Remove 
onMounted(async () => {
  console.log('🚀 App mounted, creating temporary project...')
  try {
    const project  = await createProject('My Whiteboard') as ProjectResponse
    currentProjectId.value = project.id
    console.log('✅ Project created with ID:', project.id)
  } catch (err) {
    console.error('❌ Failed to create project:', err)
  }
})

watch(shapes, () => {
  hasUnsavedChanges.value = true
}, { deep: true })

const handleShapesUpdated = (updatedShapes: Shape[]) => {
  shapes.value = updatedShapes
}

const handleSaved = () => {
  hasUnsavedChanges.value = false
}
</script>

<template>
  <div class="app">
    <Theme />
    <div class="header">
      <SaveStatusIndicator 
        :project-id="currentProjectId"
        :shapes="shapes"
        :has-unsaved-changes="hasUnsavedChanges"
        @saved="handleSaved"
      />
    </div>
    <div class="main-content">
      <LeftPanel :shapes="shapes" />
      <RightPanel @shapes-updated="handleShapesUpdated" />
    </div>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.header {
  padding: 8px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --theme-toggle-bg: #ffffff;
  --theme-toggle-color: #333333;
}

:root[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #404040;
  --theme-toggle-bg: #2d2d2d;
  --theme-toggle-color: #e0e0e0;
}

:root[data-theme="solar"] {
  --bg-primary: #fdf6e3;
  --bg-secondary: #eee8d5;
  --text-primary: #657b83;
  --text-secondary: #93a1a1;
  --border-color: #d3cbb7;
  --theme-toggle-bg: #eee8d5;
  --theme-toggle-color: #b58900;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>