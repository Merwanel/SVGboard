<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjects } from '@/composables/useProjects'
import SvgPreview from './SvgPreview.vue'

const emit = defineEmits<{
  openProject: [projectId: number]
  deleteProject: [projectId: number]
  createProject: [title: string]
}>()

const { projects, fetchProjects, isLoading } = useProjects()
const searchQuery = ref('')
const isInitialLoad = ref(true)

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
        class="project-item"
        @click="handleOpenProject(project.id)"
      >
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
  border-color: #42b983;
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
  border-color: #42b983;
  background: rgba(66, 185, 131, 0.05);
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
  border-color: #42b983;
}

.create-btn {
  padding: 0.75rem 1.5rem;
  background: #42b983;
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
  background: #35a372;
}
</style>
