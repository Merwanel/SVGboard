import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import App from '../App.vue'
import { useProjects } from '@/composables/useProjects'

vi.mock('@/composables/useProjects', () => ({
  useProjects: vi.fn()
}))

describe('App', () => {
  const mockFetchLatestProject = vi.fn()
  const mockCreateProject = vi.fn()

  const mockProject = {
    id: 1,
    title: 'Test Project',
    createdAt: '2025-11-06T12:00:00',
    updatedAt: '2025-11-06T12:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProjects).mockReturnValue({
      fetchLatestProject: mockFetchLatestProject,
      createProject: mockCreateProject,
      fetchProjects: vi.fn(),
      fetchProjectById: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      projects: ref([]),
      currentProject: ref(null),
      isLoading: ref(false),
      error: ref(null)
    })
  })

  it('should load latest project on mount', async () => {
    const projectWithSnapshots = {
      ...mockProject,
      snapshots: [{ id: 1, projectId: 1, shapesData: '[]', createdAt: '2025-11-06T12:00:00' }]
    }
    mockFetchLatestProject.mockResolvedValue(projectWithSnapshots)

    const wrapper = mount(App)
    await wrapper.vm.$nextTick()

    expect(mockFetchLatestProject).toHaveBeenCalled()
  })

  it('should create new project if none exists', async () => {
    mockFetchLatestProject.mockRejectedValue(new Error('No projects'))
    mockCreateProject.mockResolvedValue({ ...mockProject, title: 'Untitled' })

    const wrapper = mount(App)
    await wrapper.vm.$nextTick()

    expect(mockFetchLatestProject).toHaveBeenCalled()
    expect(mockCreateProject).toHaveBeenCalledWith('Untitled')
  })
})
