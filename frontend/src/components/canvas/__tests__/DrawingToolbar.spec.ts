import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DrawingToolbar from '../DrawingToolbar.vue'

describe('DrawingToolbar - drag to select', () => {
  it('should switch tool to select when drag starts', async () => {
    const wrapper = mount(DrawingToolbar, {
      props: {
        shapes: [],
      },
      global: {
        stubs: {
          WhiteboardCanvas: {
            name: 'WhiteboardCanvas',
            template: '<div />',
          },
        },
      },
    })

    const rectangleButton = wrapper.get('[title="Rectangle"]')
    await rectangleButton.trigger('click')

    const canvas = wrapper.getComponent({ name: 'WhiteboardCanvas' })
    canvas.vm.$emit('drag-started')
    await wrapper.vm.$nextTick()

    const selectButton = wrapper.get('[title="Select"]')
    expect(selectButton.classes()).toContain('active')
  })
})
