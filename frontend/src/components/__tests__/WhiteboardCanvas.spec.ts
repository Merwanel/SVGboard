import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WhiteboardCanvas from '../WhiteboardCanvas.vue'

describe('WhiteboardCanvas', () => {
  const mockShape = {
    id: 1,
    type: 'rectangle' as const,
    x: 50,
    y: 50,
    width: 100,
    height: 60,
    fill: '#42b983'
  }

  it('shows resize handles when shape is selected', async () => {
    const wrapper = mount(WhiteboardCanvas, {
      props: {
        selectedTool: 'select',
        strokeColor: '#000000',
        fillColor: '#42b983',
        initialShapes: [mockShape]
      }
    })

    expect(wrapper.findAll('.resize-handle')).toHaveLength(0)

    const shape = wrapper.find('.shape')
    await shape.trigger('mousedown')

    expect(wrapper.findAll('.resize-handle').length).toBeGreaterThan(0)
  })

  it('should resize when a handle is used', async () => {
    // Note: This tests that resize handles trigger dimension changes,
    // but does not verify its mathematical correctness
    
    const wrapper = mount(WhiteboardCanvas, {
      props: {
        selectedTool: 'select',
        strokeColor: '#000000',
        fillColor: '#42b983',
        initialShapes: [{ ...mockShape }]
      }
    })

    await wrapper.find('.shape').trigger('mousedown')
    
    const emittedBeforeResize = wrapper.emitted('shapesUpdated')?.length || 0
    
    const handle = wrapper.find('.resize-handle')
    await handle.trigger('mousedown', { clientX: 100, clientY: 100 })
    
    const svg = wrapper.find('.canvas')
    await svg.trigger('mousemove', { clientX: 200, clientY: 200 })
    
    const emitted = wrapper.emitted('shapesUpdated')
    const emittedAfterResize = emitted?.length || 0
    
    expect(emittedAfterResize).toBeGreaterThan(emittedBeforeResize)
  })
})
