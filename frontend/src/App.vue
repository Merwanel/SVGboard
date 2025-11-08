<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import SaveStatusIndicator from './components/SaveStatusIndicator.vue'
import Theme from './components/Theme.vue'
import { useProjects } from '@/composables/useProjects'
import { useSnapshots } from '@/composables/useSnapshots'
import type { Shape } from '@/types/shapes'

const shapes = ref<Shape[]>([])
const currentProjectId = ref<number | null>(null)
const hasUnsavedChanges = ref(false)
const isLoading = ref(true)

const { 
  createProject, fetchLatestProject, fetchProjectById, deleteProject, fetchProjects 
} = useProjects()
const { fetchSnapshots } = useSnapshots()

onMounted(async () => {
  try {
    const project = await fetchLatestProject()
    if (project) {
      currentProjectId.value = project.id
      
      if (project.snapshots && project.snapshots.length > 0) {
        const latestSnapshot = project.snapshots[0]
        if (latestSnapshot) {
          const parsed = JSON.parse(latestSnapshot.shapesData)
          shapes.value = Array.isArray(parsed) ? parsed : (parsed.shapes || [])
        }
      }
    }
  } catch (err) {
    try {
      const newProject = await createProject('Untitled')
      if (newProject) {
        currentProjectId.value = newProject.id
      }
    } catch (createErr) {
      console.error('Failed to create project:', err, createErr)
    }
  } finally {
    isLoading.value = false
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

const handleRestore = (snapshotId: number, shapesData: string) => {
  const parsed = JSON.parse(shapesData)
  shapes.value = Array.isArray(parsed) ? parsed : (parsed.shapes || [])
  hasUnsavedChanges.value = false
}

const handleOpenProject = async (projectId: number) => {
  try {
    const project = await fetchProjectById(projectId)
    if (project) {
      currentProjectId.value = project.id
      
      const snapshots = await fetchSnapshots(projectId)
      if (snapshots && snapshots.length > 0) {
        const latestSnapshot = snapshots[0]
        if (latestSnapshot) {
          const parsed = JSON.parse(latestSnapshot.shapesData)
          shapes.value = Array.isArray(parsed) ? parsed : (parsed.shapes || [])
        } else {
          shapes.value = []
        }
      } else {
        shapes.value = []
      }
      hasUnsavedChanges.value = false
    }
  } catch (err) {
    console.error('Failed to open project:', err)
  }
}

const handleDeleteProject = async (projectId: number) => {
  try {
    await deleteProject(projectId)
    
    await fetchProjects()
    
    if (currentProjectId.value === projectId) {
      const project = await fetchLatestProject()
      if (project) {
        currentProjectId.value = project.id
        if (project.snapshots && project.snapshots.length > 0) {
          const latestSnapshot = project.snapshots[0]
          if (latestSnapshot) {
            const parsed = JSON.parse(latestSnapshot.shapesData)
            shapes.value = Array.isArray(parsed) ? parsed : (parsed.shapes || [])
          }
        } else {
          shapes.value = []
        }
      } else {
        const newProject = await createProject('Untitled')
        if (newProject) {
          currentProjectId.value = newProject.id
          shapes.value = []
        }
      }
      hasUnsavedChanges.value = false
    }
  } catch (err) {
    console.error('Failed to delete project:', err)
  }
}

const handleCreateProject = async (title: string) => {
  try {
    const newProject = await createProject(title)
    if (newProject) {
      currentProjectId.value = newProject.id
      shapes.value = []
      hasUnsavedChanges.value = false

      await fetchProjects()
    }
  } catch (err) {
    console.error('Failed to create project:', err)
  }
}
</script>

<template>
  <div class="app">
    <Theme />
    <div v-if="isLoading" class="loading">Loading...</div>
    <template v-else>
      <div class="header">
        <SaveStatusIndicator 
          :project-id="currentProjectId"
          :shapes="shapes"
          :has-unsaved-changes="hasUnsavedChanges"
          @saved="handleSaved"
        />
      </div>
      <div class="main-content">
        <LeftPanel 
          :shapes="shapes"
          @open-project="handleOpenProject"
          @delete-project="handleDeleteProject"
          @create-project="handleCreateProject"
        />
        <RightPanel :shapes="shapes" @shapes-updated="handleShapesUpdated" />
      </div>
    </template>
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

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 18px;
  color: var(--text-secondary);
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
  --action-color: #42b983;
  --action-color-hover: #35a372;
  --action-color-light: rgba(66, 185, 131, 0.05);
  --action-color-medium: rgba(66, 185, 131, 0.1);
}

:root[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0a0;
  --border-color: #404040;
  --theme-toggle-bg: #2d2d2d;
  --theme-toggle-color: #e0e0e0;
  --action-color: #42b983;
  --action-color-hover: #35a372;
  --action-color-light: rgba(66, 185, 131, 0.05);
  --action-color-medium: rgba(66, 185, 131, 0.1);
}

:root[data-theme="solar"] {
  --bg-primary: #fdf6e3;
  --bg-secondary: #eee8d5;
  --text-primary: #657b83;
  --text-secondary: #93a1a1;
  --border-color: #d3cbb7;
  --theme-toggle-bg: #eee8d5;
  --theme-toggle-color: #b58900;
  --action-color: #42b983;
  --action-color-hover: #35a372;
  --action-color-light: rgba(66, 185, 131, 0.05);
  --action-color-medium: rgba(66, 185, 131, 0.1);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>