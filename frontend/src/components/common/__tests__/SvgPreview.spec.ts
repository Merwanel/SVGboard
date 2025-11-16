import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgPreview from '@/components/common/SvgPreview.vue'
import type { Shape } from '@/types/shapes'

describe('SvgPreview', () => {
  const createShapesData = (shapes: Shape[]): string => {
    return JSON.stringify(shapes)
  }

  const mockRectangle: Shape = {
    id: 1,
    type: 'rectangle',
    x: 10,
    y: 20,
    width: 100,
    height: 50,
    fill: '#ff0000'
  }

  const mockCircle: Shape = {
    id: 2,
    type: 'circle',
    x: 200,
    y: 150,
    radius: 30,
    fill: '#00ff00'
  }

  const mockEllipse: Shape = {
    id: 3,
    type: 'ellipse',
    x: 300,
    y: 200,
    radiusX: 40,
    radiusY: 20,
    fill: '#0000ff'
  }

  const mockLine: Shape = {
    id: 4,
    type: 'line',
    x: 50,
    y: 50,
    x2: 150,
    y2: 150,
    fill: '#000000'
  }

  it('renders multiple shapes', () => {
    const shapesData = createShapesData([mockRectangle, mockCircle, mockEllipse, mockLine])
    const wrapper = mount(SvgPreview, {
      props: { shapesData }
    })

    expect(wrapper.find('rect').exists()).toBe(true)
    expect(wrapper.find('circle').exists()).toBe(true)
    expect(wrapper.find('ellipse').exists()).toBe(true)
    expect(wrapper.find('line').exists()).toBe(true)
  })

  it('shows empty state when shapesData is empty array', () => {
    const wrapper = mount(SvgPreview, {
      props: { shapesData: '[]' }
    })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('.svg-preview__empty').exists()).toBe(true)
  })
})
