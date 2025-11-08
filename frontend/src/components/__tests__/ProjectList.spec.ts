import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ProjectList from '../ProjectList.vue'
import { useProjects } from '@/composables/useProjects'

vi.mock('@/composables/useProjects')

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

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useProjects).mockReturnValue({
      projects: ref(mockProjects),
      fetchProjects: vi.fn(),
      isLoading: ref(false)
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
    expect(wrapper.emitted('openProject')?.[0]).toEqual([1])
    
    await wrapper.find('.delete-btn').trigger('click')
    expect(wrapper.emitted('deleteProject')?.[0]).toEqual([1])
    
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
})
