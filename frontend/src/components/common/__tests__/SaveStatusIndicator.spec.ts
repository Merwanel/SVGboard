import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SaveStatusIndicator from '@/components/common/SaveStatusIndicator.vue'

describe('SaveStatusIndicator', () => {
  const createWrapper = (
    statusText: string = 'Saved',
    statusClass: 'saved' | 'unsaved' | 'saving' | 'error' = 'saved',
    showSaveButton: boolean = false,
    isSaving: boolean = false,
    autoSaveEnabled: boolean = true
  ) => {
    return mount(SaveStatusIndicator, {
      props: {
        statusText,
        statusClass,
        showSaveButton,
        isSaving,
        autoSaveEnabled
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should hide save button when no unsaved changes', () => {
    const wrapper = createWrapper('Saved', 'saved', false, false, true)

    expect(wrapper.find('.save-button').exists()).toBe(false)
    expect(wrapper.find('.status-saved').exists()).toBe(true)
  })

  it('should hide save button when auto-save is enabled', () => {
    const wrapper = createWrapper('Auto-saving...', 'unsaved', false, false, true)

    expect(wrapper.find('.save-button').exists()).toBe(false)
  })
  
  it('should show save button when has unsaved changes and auto-save disabled', () => {
    const wrapper = createWrapper('Unsaved changes', 'unsaved', true, false, false)

    expect(wrapper.find('.save-button').exists()).toBe(true)
  })

  it('should call save event when save button clicked', async () => {
    const wrapper = createWrapper('Unsaved changes', 'unsaved', true, false, false)

    await wrapper.find('.save-button').trigger('click')

    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('should emit save event when save button clicked', async () => {
    const wrapper = createWrapper('Unsaved changes', 'unsaved', true, false, false)

    await wrapper.find('.save-button').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('save')).toBeTruthy()
  })
  
  it('should emit toggleAutoSave when checkbox clicked', async () => {
    const wrapper = createWrapper('Saved', 'saved', false, false, true)
    
    await wrapper.find('.auto-save-toggle input').trigger('change')
    
    expect(wrapper.emitted('toggleAutoSave')).toBeTruthy()
  })
})
