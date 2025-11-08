import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DrawingToolbar from '../DrawingToolbar.vue'

describe('DrawingToolbar', () => {
  it('updates stroke color when color picker changes', async () => {
    const wrapper = mount(DrawingToolbar, {
      props: {
        shapes: []
      }
    })

    const colorPicker = wrapper.find('#stroke-color')
    await colorPicker.setValue('#ff0000')

    const canvas = wrapper.findComponent({ name: 'WhiteboardCanvas' })
    expect(canvas.props('strokeColor')).toBe('#ff0000')
  })
})
