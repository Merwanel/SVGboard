import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import HistoryView from '@/components/layout/HistoryView.vue'
import { useSnapshots } from '@/composables/useSnapshots'

vi.mock('@/composables/useSnapshots', () => ({
  useSnapshots: vi.fn()
}))

describe('HistoryView', () => {
  const mockFetchSnapshots = vi.fn()
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSnapshots).mockReturnValue({
      fetchSnapshots: mockFetchSnapshots,
      snapshots: ref([]),
      currentSnapshot: ref(null),
      isLoading: ref(false),
      error: ref(null),
      fetchSnapshotById: vi.fn(),
      deserializeShapes: vi.fn(),
      serializeShapes: vi.fn(),
      createSnapshot: vi.fn(),
      deleteSnapshot: vi.fn(),
      deleteAllSnapshots: vi.fn()
    })

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
