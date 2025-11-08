import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HistoryView from '../HistoryView.vue'
import { useSnapshots } from '@/composables/useSnapshots'

vi.mock('@/composables/useSnapshots', () => ({
  useSnapshots: vi.fn()
}))

describe('HistoryView', () => {
  const mockFetchSnapshots = vi.fn()
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSnapshots).mockReturnValue({
      fetchSnapshots: mockFetchSnapshots,
      snapshots: { value: [] },
      currentSnapshot: { value: null },
      isLoading: { value: false },
      error: { value: null },
      fetchSnapshotById: vi.fn(),
      deserializeShapes: vi.fn(),
      serializeShapes: vi.fn(),
      createSnapshot: vi.fn(),
      deleteSnapshot: vi.fn(),
      deleteAllSnapshots: vi.fn()
    } as any)

    wrapper = mount(HistoryView, {
      props: { projectId: 1 }
    })
  })

  it('should fetch snapshots on mount', () => {
    expect(mockFetchSnapshots).toHaveBeenCalledWith(1)
  })

  it('should render history view', () => {
    expect(wrapper.find('h3').text()).toBe('History')
  })
})
