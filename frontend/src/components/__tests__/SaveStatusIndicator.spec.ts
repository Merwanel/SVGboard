import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SaveStatusIndicator from '../SaveStatusIndicator.vue'
import { useSnapshots } from '@/composables/useSnapshots'

vi.mock('@/composables/useSnapshots', () => ({
  useSnapshots: vi.fn()
}))

describe('SaveStatusIndicator', () => {
  const mockCreateSnapshot = vi.fn()

  const createWrapper = (hasUnsavedChanges: boolean, shapes: any[] = []) => {
    return mount(SaveStatusIndicator, {
      props: {
        projectId: 1,
        shapes,
        hasUnsavedChanges
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSnapshots).mockReturnValue({
      createSnapshot: mockCreateSnapshot,
      error: { value: null },
      snapshots: { value: [] },
      currentSnapshot: { value: null },
      isLoading: { value: false },
      fetchSnapshots: vi.fn(),
      fetchSnapshotById: vi.fn(),
      deserializeShapes: vi.fn(),
      serializeShapes: vi.fn(),
      deleteSnapshot: vi.fn(),
      deleteAllSnapshots: vi.fn()
    } as any)
  })

  it('should hide save button when no unsaved changes', () => {
    const wrapper = createWrapper(false)

    expect(wrapper.find('.save-button').exists()).toBe(false)
    expect(wrapper.find('.status-saved').exists()).toBe(true)
  })

  it('should show save button when has unsaved changes', () => {
    const wrapper = createWrapper(true)

    expect(wrapper.find('.save-button').exists()).toBe(true)
    expect(wrapper.find('.status-unsaved').exists()).toBe(true)
  })

  it('should call createSnapshot when save button clicked', async () => {
    mockCreateSnapshot.mockResolvedValue({})

    const shapes = [{ id: 1, type: 'rectangle', x: 10, y: 20, fill: '#000' }]
    const wrapper = createWrapper(true, shapes)

    await wrapper.find('.save-button').trigger('click')

    expect(mockCreateSnapshot).toHaveBeenCalledWith(1, shapes)
  })

  it('should emit saved event after successful save', async () => {
    mockCreateSnapshot.mockResolvedValue({})

    const wrapper = createWrapper(true)

    await wrapper.find('.save-button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('saved')).toBeTruthy()
  })
})
