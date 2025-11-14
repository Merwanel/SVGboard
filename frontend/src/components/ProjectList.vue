<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects'
import { useSnapshots } from '@/composables/useSnapshots'
import ProjectItem from './ProjectItem.vue'
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
      <ProjectItem
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        :is-expanded="expandedProjectId === project.id"
        :snapshots="projectSnapshots[project.id]"
        @open="handleOpenProject"
        @delete="handleDeleteProject"
        @toggle-expand="toggleProjectExpand"
        @restore-snapshot="handleRestoreSnapshot"
      />
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


</style>