<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects'
import { useSnapshots } from '@/composables/useSnapshots'
import SvgPreview from './SvgPreview.vue'
import type { SnapshotResponse } from '@/types/api'

const emit = defineEmits<{
  openProject: [projectId: number]
  deleteProject: [projectId: number]
  createProject: [title: string]
  restoreSnapshot: [snapshotId: number, shapesData: string]
}>()

const { projects, fetchProjects, isLoading } = useProjects()
const { fetchSnapshots } = useSnapshots()
const searchQuery = ref('')
const isInitialLoad = ref(true)
const expandedProjectId = ref<number | null>(null)
const projectSnapshots = ref<Record<number, SnapshotResponse[]>>({})

onMounted(async () => {
  await fetchProjects()
  isInitialLoad.value = false
})

const filteredProjects = computed(() => {
  if (!searchQuery.value.trim()) {
    return projects.value
  }
  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(project => 
    project.title.toLowerCase().includes(query)
  )
})

const handleOpenProject = (projectId: number) => {
  emit('openProject', projectId)
}

const handleDeleteProject = (projectId: number) => {
  emit('deleteProject', projectId)
}

const newProjectTitle = ref('')

const handleCreateProject = () => {
  const title = newProjectTitle.value.trim() || 'Untitled'
  emit('createProject', title)
  newProjectTitle.value = ''
}

const toggleProjectExpand = async (projectId: number) => {
  if (expandedProjectId.value === projectId) {
    expandedProjectId.value = null
  } else {
    expandedProjectId.value = projectId
    if (!projectSnapshots.value[projectId]) {
      const snapshots = await fetchSnapshots(projectId)
      if (snapshots) {
        projectSnapshots.value[projectId] = snapshots
      }
    }
  }
}

const handleRestoreSnapshot = (snapshotId: number, shapesData: string) => {
  emit('restoreSnapshot', snapshotId, shapesData)
}

const getLatestSnapshotData = (project: any): string => {
  return project.lastShapesData || '[]'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="project-list">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search projects..."
        class="search-input"
      />
    </div>

    <div v-if="isLoading && isInitialLoad" class="loading">
      Loading projects...
    </div>

    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <p v-if="searchQuery">No projects found matching "{{ searchQuery }}"</p>
      <p v-else>No projects yet. Create your first project!</p>
    </div>

    <div v-else class="projects">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-wrapper"
      >
        <div class="project-item" @click="handleOpenProject(project.id)">
          <button
            class="expand-toggle"
            @click.stop="toggleProjectExpand(project.id)"
            :title="expandedProjectId === project.id ? 'Collapse' : 'Expand snapshots'"
          >
            {{ expandedProjectId === project.id ? '▼' : '▶' }}
          </button>
          <div class="project-preview">
            <SvgPreview
              :shapes-data="getLatestSnapshotData(project)"
              size="large"
            />
          </div>
          <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-date">{{ formatDate(project.updatedAt) }}</p>
          </div>
          <button
            class="delete-btn"
            @click.stop="handleDeleteProject(project.id)"
            title="Delete project"
          >
            ×
          </button>
        </div>
        
        <div v-if="expandedProjectId === project.id" class="snapshots-list">
          <div
            v-for="snapshot in projectSnapshots[project.id]"
            :key="snapshot.id"
            class="snapshot-item"
            @click="handleRestoreSnapshot(snapshot.id, snapshot.shapesData)"
          >
            <div class="snapshot-preview">
              <SvgPreview
                :shapes-data="snapshot.shapesData"
                size="small"
              />
            </div>
            <div class="snapshot-info">
              <p class="snapshot-date">{{ formatDate(snapshot.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="create-project">
      <input
        v-model="newProjectTitle"
        type="text"
        placeholder="Project name..."
        class="project-input"
        @keyup.enter="handleCreateProject"
      />
      <button class="create-btn" @click="handleCreateProject">
        + New
      </button>
    </div>
  </div>
</template>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-bar {
  padding: 0.5rem 0;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
  border-color: var(--action-color);
}

.loading,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.projects {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-wrapper {
  display: flex;
  flex-direction: column;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.project-item:hover {
  border-color: var(--action-color);
  background: var(--action-color-light);
}

.expand-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.expand-toggle:hover {
  color: var(--action-color);
}

.project-preview {
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.project-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.2);
}

.project-date {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.create-project {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.project-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.project-input:focus {
  outline: none;
  border-color: var(--action-color);
}

.create-btn {
  padding: 0.75rem 1.5rem;
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}

.create-btn:hover {
  background: var(--action-color-hover);
}

.snapshots-list {
  margin-left: 2rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.snapshot-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-secondary);
}

.snapshot-item:hover {
  border-color: var(--action-color);
  background: var(--action-color-medium);
}

.snapshot-preview {
  flex-shrink: 0;
}

.snapshot-info {
  flex: 1;
  min-width: 0;
}

.snapshot-date {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>