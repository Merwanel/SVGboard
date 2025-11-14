import { ref } from 'vue'
import type { AnimationTrack } from '@/types/shapes'

export function useTrackDragResize(
  tracks: () => AnimationTrack[],
  totalDuration: () => number,
  onUpdate: (tracks: AnimationTrack[]) => void
) {
  const isDragging = ref(false)
  const isResizing = ref(false)
  const dragStartX = ref(0)
  const dragStartTime = ref(0)
  const resizeEdge = ref<'start' | 'end' | null>(null)
  const activeTrackId = ref<number | null>(null)

  const startDrag = (event: MouseEvent, trackId: number) => {
    const track = tracks().find(t => t.id === trackId)
    if (!track) return

    isDragging.value = true
    activeTrackId.value = trackId
    dragStartX.value = event.clientX
    dragStartTime.value = track.startTime

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  const handleDrag = (event: MouseEvent) => {
    if (!isDragging.value || !activeTrackId.value) return

    const track = tracks().find(t => t.id === activeTrackId.value)
    if (!track) return

    const timeline = document.querySelector('.track-timeline')
    if (!timeline) return

    const rect = timeline.getBoundingClientRect()
    const deltaX = event.clientX - dragStartX.value
    const deltaTime = (deltaX / rect.width) * totalDuration()

    let newStartTime = dragStartTime.value + deltaTime
    newStartTime = Math.max(0, Math.min(newStartTime, totalDuration() - track.duration))

    const updatedTracks = tracks().map(t => {
      if (t.id === activeTrackId.value) {
        return { ...t, startTime: newStartTime }
      }
      return t
    })
    onUpdate(updatedTracks)
  }

  const stopDrag = () => {
    isDragging.value = false
    isResizing.value = false
    resizeEdge.value = null
    activeTrackId.value = null
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('mousemove', handleResize)
  }

  const startResize = (event: MouseEvent, trackId: number, edge: 'start' | 'end') => {
    event.stopPropagation()
    const track = tracks().find(t => t.id === trackId)
    if (!track) return

    isResizing.value = true
    activeTrackId.value = trackId
    resizeEdge.value = edge
    dragStartX.value = event.clientX
    dragStartTime.value = edge === 'start' ? track.startTime : track.startTime + track.duration

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopDrag)
  }

  const handleResize = (event: MouseEvent) => {
    if (!isResizing.value || !activeTrackId.value || !resizeEdge.value) return

    const track = tracks().find(t => t.id === activeTrackId.value)
    if (!track) return

    const timeline = document.querySelector('.track-timeline')
    if (!timeline) return

    const rect = timeline.getBoundingClientRect()
    const deltaX = event.clientX - dragStartX.value
    const deltaTime = (deltaX / rect.width) * totalDuration()

    const updatedTracks = tracks().map(t => {
      if (t.id === activeTrackId.value) {
        if (resizeEdge.value === 'start') {
          let newStartTime = dragStartTime.value + deltaTime
          newStartTime = Math.max(0, Math.min(newStartTime, t.startTime + t.duration - 0.5))
          const newDuration = t.duration + (t.startTime - newStartTime)
          return { ...t, startTime: newStartTime, duration: newDuration }
        } else {
          let newEndTime = dragStartTime.value + deltaTime
          newEndTime = Math.max(t.startTime + 0.5, Math.min(newEndTime, totalDuration()))
          const newDuration = newEndTime - t.startTime
          return { ...t, duration: newDuration }
        }
      }
      return t
    })
    onUpdate(updatedTracks)
  }

  return {
    startDrag,
    startResize
  }
}
