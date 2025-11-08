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

  it('updates fill color when color picker changes', async () => {
    const wrapper = mount(DrawingToolbar, {
      props: {
        shapes: []
      }
    })

    const colorPicker = wrapper.find('#fill-color')
    await colorPicker.setValue('#00ff00')

    const canvas = wrapper.findComponent({ name: 'WhiteboardCanvas' })
    expect(canvas.props('fillColor')).toBe('#00ff00')
  })

  it('sets fill to none when no fill checkbox is checked', async () => {
    const wrapper = mount(DrawingToolbar, {
      props: {
        shapes: []
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    const canvas = wrapper.findComponent({ name: 'WhiteboardCanvas' })
    expect(canvas.props('fillColor')).toBe('none')
  })
})
