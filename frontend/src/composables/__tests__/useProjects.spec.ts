import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useProjects } from '../useProjects'
import { apiClient } from '../useApi'

vi.mock('../useApi', () => ({
  apiClient: {
    get: vi.fn()
  }
}))

describe('useProjects', () => {
  const mockProject = {
    id: 1,
    title: 'Project 1',
    createdAt: '2025-11-06T12:00:00',
    updatedAt: '2025-11-06T12:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch all projects', async () => {
    const mockProjects = [mockProject, { ...mockProject, id: 2, title: 'Project 2' }]

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProjects })

    const { fetchProjects, projects } = useProjects()
    const result = await fetchProjects()

    expect(apiClient.get).toHaveBeenCalledWith('/projects')
    expect(result).toEqual(mockProjects)
    expect(projects.value).toEqual(mockProjects)
  })

  it('should fetch project by id', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProject })

    const { fetchProjectById } = useProjects()
    const result = await fetchProjectById(1)

    expect(apiClient.get).toHaveBeenCalledWith('/projects/1')
    expect(result).toEqual(mockProject)
  })

  it('should fetch latest project with snapshots', async () => {
    const mockProjectWithSnapshots = {
      ...mockProject,
      snapshots: [{ id: 1, projectId: 1, shapesData: '[]', createdAt: '2025-11-06T12:00:00' }]
    }

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProjectWithSnapshots })

    const { fetchLatestProject, currentProject } = useProjects()
    const result = await fetchLatestProject()

    expect(apiClient.get).toHaveBeenCalledWith('/projects/latest')
    expect(result).toEqual(mockProjectWithSnapshots)
    expect(currentProject.value).toEqual(mockProjectWithSnapshots)
  })
})
