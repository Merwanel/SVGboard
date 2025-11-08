import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnimationTimeline from '../AnimationTimeline.vue'

describe('AnimationTimeline', () => {
  const mockShapeId = 1
  const mockTracks = [
    {
      id: 1,
      type: 'rotate' as const,
      startTime: 0,
      duration: 2,
      values: { from: 0, to: 360 }
    }
  ]

  it('renders timeline with tracks', () => {
    const wrapper = mount(AnimationTimeline, {
      props: {
        selectedShapeId: mockShapeId,
        tracks: mockTracks,
        totalDuration: 5
      }
    })

    expect(wrapper.find('.track-row').exists()).toBe(true)
    expect(wrapper.find('.track-label').text()).toBe('rotate')
  })
})
