import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProjects } from '../useProjects'
import { apiClient } from '../useApi'

vi.mock('../useApi', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

describe('useProjects', () => {
  const mockProject = {
    id: 1,
    title: 'Project 1',
    createdAt: '2025-11-06T12:00:00',
    updatedAt: '2025-11-06T12:00:00'
  }

  const { fetchProjects, fetchProjectById, fetchLatestProject, createProject, updateProject, deleteProject } = useProjects()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProject })
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockProject })
    vi.mocked(apiClient.patch).mockResolvedValue({ data: mockProject })
    vi.mocked(apiClient.delete).mockResolvedValue({})
  })

  it('should call GET /projects', async () => {
    await fetchProjects()
    expect(apiClient.get).toHaveBeenCalledWith('/projects')
  })

  it('should call GET /projects/:id', async () => {
    await fetchProjectById(1)
    expect(apiClient.get).toHaveBeenCalledWith('/projects/1')
  })

  it('should call GET /projects/latest', async () => {
    await fetchLatestProject()
    expect(apiClient.get).toHaveBeenCalledWith('/projects/latest')
  })

  it('should call POST /projects', async () => {
    await createProject('New Project')
    expect(apiClient.post).toHaveBeenCalledWith('/projects', { title: 'New Project' })
  })

  it('should call PATCH /projects/:id', async () => {
    await updateProject(1, 'Updated Title')
    expect(apiClient.patch).toHaveBeenCalledWith('/projects/1', { title: 'Updated Title' })
  })

  it('should call DELETE /projects/:id', async () => {
    await deleteProject(1)
    expect(apiClient.delete).toHaveBeenCalledWith('/projects/1')
  })
})
