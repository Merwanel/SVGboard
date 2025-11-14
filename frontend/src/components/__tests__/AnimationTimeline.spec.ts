import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import AnimationTimeline from '@/components//animation/AnimationTimeline.vue'

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

  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(AnimationTimeline, {
      props: {
        selectedShapeId: mockShapeId,
        tracks: mockTracks,
        totalDuration: 5
      }
    })
  })

  it('renders timeline with tracks', () => {
    expect(wrapper.find('.track-row').exists()).toBe(true)
    expect((wrapper.find('.track-type-select').element as HTMLSelectElement).value).toBe('rotate')
  })

  it('shows editor when track is selected', async () => {
    expect(wrapper.find('.track-editor').exists()).toBe(false)

    await wrapper.find('.track-block').trigger('click')
    
    expect(wrapper.find('.track-editor h4').text().toLowerCase()).toBe('edit ' + mockTracks[0]?.type.toLowerCase())
  })
})
