import { ref } from 'vue'
import { apiClient } from './useApi'
import { createErrorHandler } from './useErrorHandler'
import type { SnapshotResponse } from '@/types/api'
import type { Shape } from '@/types/shapes'

const snapshots = ref<SnapshotResponse[]>([])
const currentSnapshot = ref<SnapshotResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useSnapshots() {
  const setErrorAndThrow = createErrorHandler(error)

  const deserializeShapes = (shapesData: string): Shape[] => {
    try {
      return JSON.parse(shapesData)
    } catch {
      return []
    }
  }

  const fetchSnapshots = async (projectId: number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<SnapshotResponse[]>(`/projects/${projectId}/snapshots`)
      snapshots.value = response.data
      return response.data
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to fetch snapshots')
    } finally {
      isLoading.value = false
    }
  }

  const fetchSnapshotById = async (projectId: number, snapshotId: number) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.get<SnapshotResponse>(`/projects/${projectId}/snapshots/${snapshotId}`)
      currentSnapshot.value = response.data
      return response.data
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to fetch snapshot')
    } finally {
      isLoading.value = false
    }
  }

  const serializeShapes = (shapes: Shape[]): string => {
    return JSON.stringify(shapes)
  }

  const createSnapshot = async (projectId: number, shapes: Shape[]) => {
    isLoading.value = true
    error.value = null
    try {
      const shapesData = serializeShapes(shapes)
      const response = await apiClient.post<SnapshotResponse>(`/projects/${projectId}/snapshots`, { shapesData })
      return response.data
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to create snapshot')
    } finally {
      isLoading.value = false
    }
  }

  const deleteSnapshot = async (projectId: number, snapshotId: number) => {
    isLoading.value = true
    error.value = null
    try {
      await apiClient.delete(`/projects/${projectId}/snapshots/${snapshotId}`)
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to delete snapshot')
    } finally {
      isLoading.value = false
    }
  }

  const deleteAllSnapshots = async (projectId: number) => {
    isLoading.value = true
    error.value = null
    try {
      await apiClient.delete(`/projects/${projectId}/snapshots`)
    } catch (err: unknown) {
      setErrorAndThrow(err, 'Failed to delete all snapshots')
    } finally {
      isLoading.value = false
    }
  }

  return {
    snapshots,
    currentSnapshot,
    isLoading,
    error,
    fetchSnapshots,
    fetchSnapshotById,
    deserializeShapes,
    serializeShapes,
    createSnapshot,
    deleteSnapshot,
    deleteAllSnapshots
  }
}
