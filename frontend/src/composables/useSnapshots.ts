import { ref } from 'vue'
import { apiClient } from './useApi'
import type { SnapshotResponse } from '@/types/api'
import type { Shape } from '@/types/shapes'

const snapshots = ref<SnapshotResponse[]>([])
const currentSnapshot = ref<SnapshotResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useSnapshots() {
  const setError = (err: unknown, fallback: string) => {
    error.value = err instanceof Error ? err.message : fallback
  }

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
      setError(err, 'Failed to fetch snapshots')
      throw err
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
      setError(err, 'Failed to fetch snapshot')
      throw err
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
    deserializeShapes
  }
}
