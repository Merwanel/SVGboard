import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSnapshots } from '../useSnapshots'
import { apiClient } from '../useApi'

vi.mock('../useApi', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

describe('useSnapshots', () => {
  const mockSnapshot = {
    id: 1,
    projectId: 1,
    shapesData: '[{"id":1,"type":"rectangle","x":10,"y":20,"width":100,"height":50,"fill":"#000"}]',
    createdAt: '2025-11-06T12:00:00'
  }

  const {
    fetchSnapshots,
    fetchSnapshotById,
    deserializeShapes,
    serializeShapes,
    createSnapshot,
    deleteSnapshot,
    deleteAllSnapshots
  } = useSnapshots()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockSnapshot })
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockSnapshot })
    vi.mocked(apiClient.delete).mockResolvedValue({})
  })

  it('should call GET /projects/:projectId/snapshots', async () => {
    await fetchSnapshots(1)
    expect(apiClient.get).toHaveBeenCalledWith('/projects/1/snapshots')
  })

  it('should call GET /projects/:projectId/snapshots/:snapshotId', async () => {
    await fetchSnapshotById(1, 2)
    expect(apiClient.get).toHaveBeenCalledWith('/projects/1/snapshots/2')
  })

  it('should deserialize shapes from JSON string', () => {
    const shapesData = '[{"id":1,"type":"rectangle","x":10,"y":20,"fill":"#000"}]'
    const shapes = deserializeShapes(shapesData)

    expect(shapes).toEqual([{ id: 1, type: 'rectangle', x: 10, y: 20, fill: '#000' }])
  })

  it('should return empty array for invalid JSON', () => {
    const shapes = deserializeShapes('invalid json')
    expect(shapes).toEqual([])
  })

  it('should serialize shapes to JSON string', () => {
    const shapes = [{ id: 1, type: 'rectangle' as const, x: 10, y: 20, fill: '#000' }]
    const shapesData = serializeShapes(shapes)

    expect(shapesData).toBe('[{"id":1,"type":"rectangle","x":10,"y":20,"fill":"#000"}]')
  })

  it('should call POST /projects/:projectId/snapshots', async () => {
    const shapes = [{ id: 1, type: 'rectangle' as const, x: 10, y: 20, fill: '#000' }]
    await createSnapshot(1, shapes)

    expect(apiClient.post).toHaveBeenCalledWith('/projects/1/snapshots', {
      shapesData: '[{"id":1,"type":"rectangle","x":10,"y":20,"fill":"#000"}]'
    })
  })

  it('should call DELETE /projects/:projectId/snapshots/:snapshotId', async () => {
    await deleteSnapshot(1, 2)
    expect(apiClient.delete).toHaveBeenCalledWith('/projects/1/snapshots/2')
  })

  it('should call DELETE /projects/:projectId/snapshots', async () => {
    await deleteAllSnapshots(1)
    expect(apiClient.delete).toHaveBeenCalledWith('/projects/1/snapshots')
  })
})
