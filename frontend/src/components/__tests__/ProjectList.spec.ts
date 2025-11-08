import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ProjectList from '../ProjectList.vue'
import { useProjects } from '@/composables/useProjects'
import { useSnapshots } from '@/composables/useSnapshots'

vi.mock('@/composables/useProjects')
vi.mock('@/composables/useSnapshots')

describe('ProjectList', () => {
  const mockProjects = [
    {
      id: 1,
      title: 'Project Alpha',
      snapshots: [
        { id: 1, shapesData: '[{"id":1,"type":"rectangle","x":10,"y":10,"width":50,"height":50,"fill":"#ff0000"}]' }
      ]
    },
    {
      id: 2,
      title: 'Project Beta',
      snapshots: []
    },
    {
      id: 3,
      title: 'Another Project',
      snapshots: [
        { id: 2, shapesData: '[{"id":2,"type":"circle","x":100,"y":100,"radius":30,"fill":"#00ff00"}]' }
      ]
    }
  ]

  const mockSnapshots = [
    {
      id: 101,
      projectId: 1,
      shapesData: '[{"id":1,"type":"rectangle","x":10,"y":10,"width":50,"height":50}]',
      createdAt: '2024-01-01T10:00:00Z'
    },
    {
      id: 102,
      projectId: 1,
      shapesData: '[{"id":2,"type":"circle","x":20,"y":20,"radius":30}]',
      createdAt: '2024-01-01T11:00:00Z'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProjects).mockReturnValue({
      projects: ref(mockProjects),
      fetchProjects: vi.fn(),
      isLoading: ref(false)
    } as any)
    vi.mocked(useSnapshots).mockReturnValue({
      fetchSnapshots: vi.fn().mockResolvedValue(mockSnapshots)
    } as any)
  })

  it('displays and filters projects', async () => {
    const wrapper = mount(ProjectList)
    
    expect(wrapper.findAll('.project-item')).toHaveLength(3)
    
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('beta')
    
    expect(wrapper.findAll('.project-item')).toHaveLength(1)
    expect(wrapper.text()).toContain('Project Beta')
  })

  it('emits events for project actions', async () => {
    const wrapper = mount(ProjectList)
    
    await wrapper.find('.project-item').trigger('click')
    expect(wrapper.emitted('openProject')?.[0]).toEqual([mockProjects[0]?.id])
    
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.emitted('deleteProject')?.[0]).toEqual([mockProjects[0]?.id])
    
    await wrapper.find('.create-btn').trigger('click')
    expect(wrapper.emitted('createProject')).toBeTruthy()
  })

  it('shows empty state when no projects', () => {
    vi.mocked(useProjects).mockReturnValue({
      projects: ref([]),
      fetchProjects: vi.fn(),
      isLoading: ref(false)
    } as any)
    
    const wrapper = mount(ProjectList)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('expands and collapses project to show snapshots', async () => {
    const wrapper = mount(ProjectList)
    
    expect(wrapper.find('.snapshots-list').exists()).toBe(false)
    
    await wrapper.find('.expand-toggle').trigger('click')
    
    expect(vi.mocked(useSnapshots)().fetchSnapshots).toHaveBeenCalledWith(mockProjects[0]?.id)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.snapshots-list').exists()).toBe(true)
    expect(wrapper.findAll('.snapshot-item')).toHaveLength(mockSnapshots.length)
    
    await wrapper.find('.expand-toggle').trigger('click')
    expect(wrapper.find('.snapshots-list').exists()).toBe(false)
  })

  it('emits restore event when snapshot is clicked', async () => {
    const wrapper = mount(ProjectList)
    
    await wrapper.find('.expand-toggle').trigger('click')
    await wrapper.vm.$nextTick()
    
    await wrapper.find('.snapshot-item').trigger('click')
    
    expect(wrapper.emitted('restoreSnapshot')?.[0]).toEqual([
      mockSnapshots[0]?.id,
      '[{"id":1,"type":"rectangle","x":10,"y":10,"width":50,"height":50}]'
    ])
  })
})
