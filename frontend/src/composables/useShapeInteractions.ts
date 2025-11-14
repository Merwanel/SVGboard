import { ref } from 'vue'
import type { Shape } from '@/types/shapes'

const DRAG_THRESHOLD = 3

export function useShapeInteractions(
  shapes: () => Shape[],
  onUpdate: (shapes: Shape[]) => void
) {
  const draggingShape = ref<number | null>(null)
  const resizingShape = ref<{ id: number; handle: string } | null>(null)
  const dragOffset = ref({ x: -1, y: -1 })
  const dragStartPos = ref({ x: 0, y: 0 })
  const hasMoved = ref(false)

  const startDrag = (event: MouseEvent, shapeId: number) => {
    event.stopPropagation()
    const shape = shapes().find(s => s.id === shapeId)
    if (!shape) return

    const svg = (event.currentTarget as SVGElement).ownerSVGElement || (event.currentTarget as SVGElement)
    const rect = svg.getBoundingClientRect()

    draggingShape.value = shapeId
    dragOffset.value = {
      x: event.clientX - rect.left - shape.x,
      y: event.clientY - rect.top - shape.y
    }
    dragStartPos.value = {
      x: event.clientX,
      y: event.clientY
    }
    hasMoved.value = false
  }

  const handleDrag = (event: MouseEvent) => {
    if (resizingShape.value) {
      handleResize(event)
      return
    }

    if (draggingShape.value === null) return

    const shapeList = shapes()
    const shape = shapeList.find(s => s.id === draggingShape.value)
    if (!shape) return

    const dx = Math.abs(event.clientX - dragStartPos.value.x)
    const dy = Math.abs(event.clientY - dragStartPos.value.y)
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      hasMoved.value = true
    }

    const svg = event.currentTarget as SVGElement
    const rect = svg.getBoundingClientRect()

    shape.x = event.clientX - rect.left - dragOffset.value.x
    shape.y = event.clientY - rect.top - dragOffset.value.y

    if (shape.type === 'line' && shape.x2 !== undefined && shape.y2 !== undefined) {
      const dx = shape.x2 - (event.clientX - rect.left - dragOffset.value.x)
      const dy = shape.y2 - (event.clientY - rect.top - dragOffset.value.y)
      shape.x2 = shape.x + dx
      shape.y2 = shape.y + dy
    }

    onUpdate(shapeList)
  }

  const stopDrag = () => {
    draggingShape.value = null
    resizingShape.value = null
    setTimeout(() => {
      hasMoved.value = false
    }, 0)
  }

  const startResize = (event: MouseEvent, shapeId: number, handle: string) => {
    event.stopPropagation()
    resizingShape.value = { id: shapeId, handle }
    dragStartPos.value = {
      x: event.clientX,
      y: event.clientY
    }
  }

  const handleResize = (event: MouseEvent) => {
    if (!resizingShape.value) return

    const shapeList = shapes()
    const shape = shapeList.find(s => s.id === resizingShape.value!.id)
    if (!shape) return

    const svg = event.currentTarget as SVGElement
    const rect = svg.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    const handle = resizingShape.value.handle

    if (shape.type === 'rectangle') {
      if (handle.includes('e')) {
        shape.width = Math.max(10, mouseX - shape.x)
      }
      if (handle.includes('w')) {
        const newX = mouseX
        const newWidth = shape.width! + (shape.x - newX)
        if (newWidth > 10) {
          shape.x = newX
          shape.width = newWidth
        }
      }
      if (handle.includes('s')) {
        shape.height = Math.max(10, mouseY - shape.y)
      }
      if (handle.includes('n')) {
        const newY = mouseY
        const newHeight = shape.height! + (shape.y - newY)
        if (newHeight > 10) {
          shape.y = newY
          shape.height = newHeight
        }
      }
    } else if (shape.type === 'circle') {
      const dx = mouseX - shape.x
      const dy = mouseY - shape.y
      shape.radius = Math.max(5, Math.sqrt(dx * dx + dy * dy))
    } else if (shape.type === 'ellipse') {
      if (handle === 'e' || handle === 'w') {
        shape.radiusX = Math.max(5, Math.abs(mouseX - shape.x))
      }
      if (handle === 'n' || handle === 's') {
        shape.radiusY = Math.max(5, Math.abs(mouseY - shape.y))
      }
    }

    onUpdate(shapeList)
  }

  return {
    hasMoved,
    startDrag,
    handleDrag,
    stopDrag,
    startResize
  }
}
