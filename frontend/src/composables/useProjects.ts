import { ref } from 'vue'
import { apiClient } from './useApi'
import type { ProjectResponse, ProjectWithSnapshotsResponse } from '@/types/api'

const projects = ref<ProjectResponse[]>([])
const currentProject = ref<ProjectWithSnapshotsResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useProjects() {
  const fetchProjects = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ProjectResponse[]>('/projects')
      projects.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch projects'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchProjectById = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ProjectResponse>(`/projects/${id}`)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchLatestProject = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ProjectWithSnapshotsResponse>('/projects/latest')
      currentProject.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch latest project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    fetchProjects,
    fetchProjectById,
    fetchLatestProject
  }
}
