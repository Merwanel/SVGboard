import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimationPanel from '../AnimationPanel.vue'

describe('AnimationPanel', () => {
  
  it('emits apply animation event when apply button is clicked', async () => {
    const mockShapeId = 1
    const wrapper = mount(AnimationPanel, {
      props: {
        selectedShapeId: mockShapeId
      }
    })

    const typeSelect = wrapper.find('#animation-type')
    await typeSelect.setValue('scale')

    const durationSlider = wrapper.find('#duration')
    await durationSlider.setValue('5')

    const applyBtn = wrapper.find('.apply-btn')
    await applyBtn.trigger('click')

    expect(wrapper.emitted('applyAnimation')?.[0]).toEqual([mockShapeId, 'scale', 5, true])
  })
})
