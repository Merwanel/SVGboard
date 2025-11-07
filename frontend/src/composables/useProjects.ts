import { ref } from 'vue'
import { apiClient } from './useApi'
import { createErrorHandler } from './useErrorHandler'
import type { ProjectResponse, ProjectWithSnapshotsResponse } from '@/types/api'

const projects = ref<ProjectResponse[]>([])
const currentProject = ref<ProjectWithSnapshotsResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useProjects() {
  const setErrorAndThrow = createErrorHandler(error)

  const fetchProjects = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<ProjectResponse[]>('/projects')
      projects.value = response.data
      return response.data
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to fetch projects')
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
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to fetch project')
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
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to fetch latest project')
    } finally {
      isLoading.value = false
    }
  }

  const createProject = async (title: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post<ProjectResponse>('/projects', { title })
      return response.data
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to create project')
    } finally {
      isLoading.value = false
    }
  }

  const updateProject = async (id: number, title: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.patch<ProjectResponse>(`/projects/${id}`, { title })
      return response.data
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to update project')
    } finally {
      isLoading.value = false
    }
  }

  const deleteProject = async (id: number) => {
    isLoading.value = true
    error.value = null
    try {
      await apiClient.delete(`/projects/${id}`)
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to delete project')
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
    fetchLatestProject,
    createProject,
    updateProject,
    deleteProject
  }
}
