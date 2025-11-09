import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import App from '../App.vue'
import { useProjects } from '@/composables/useProjects'
import { useSnapshots } from '@/composables/useSnapshots'

vi.mock('@/composables/useProjects', () => ({
  useProjects: vi.fn()
}))

vi.mock('@/composables/useSnapshots', () => ({
  useSnapshots: vi.fn()
}))

describe('App', () => {
  const mockFetchLatestProject = vi.fn()
  const mockCreateProject = vi.fn()
  const mockCreateSnapshot = vi.fn()
  const mockFetchSnapshots = vi.fn()

  const mockProject = {
    id: 1,
    title: 'Test Project',
    createdAt: '2025-11-06T12:00:00',
    updatedAt: '2025-11-06T12:00:00'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
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
    
    vi.mocked(useSnapshots).mockReturnValue({
      createSnapshot: mockCreateSnapshot,
      fetchSnapshots: mockFetchSnapshots,
      fetchSnapshotById: vi.fn(),
      deleteSnapshot: vi.fn(),
      deleteAllSnapshots: vi.fn(),
      deserializeShapes: vi.fn(),
      serializeShapes: vi.fn(),
      snapshots: ref([]),
      currentSnapshot: ref(null),
      isLoading: ref(false),
      error: ref(null)
    })
  })
  
  afterEach(() => {
    vi.useRealTimers()
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
  
  it('should auto-save after changes when auto-save is enabled', async () => {
    const projectWithSnapshots = {
      ...mockProject,
      snapshots: [{ id: 1, projectId: mockProject.id, shapesData: '[]', createdAt: '2025-11-06T12:00:00' }]
    }
    mockFetchLatestProject.mockResolvedValue(projectWithSnapshots)
    mockCreateSnapshot.mockResolvedValue({ id: 2, projectId: mockProject.id, shapesData: '[]', createdAt: '2025-11-06T12:01:00' })

    const wrapper = mount(App)
    await flushPromises()
    
    const rightPanel = wrapper.findComponent({ name: 'RightPanel' })
    const testShapes = [{ id: 1, type: 'rectangle', x: 10, y: 10, width: 50, height: 50, fill: '#000' }]
    rightPanel.vm.$emit('shapes-updated', testShapes)
    
    vi.advanceTimersByTime(2000)
    await flushPromises()
    
    expect(mockCreateSnapshot).toHaveBeenCalledWith(mockProject.id, testShapes)
  })
})
