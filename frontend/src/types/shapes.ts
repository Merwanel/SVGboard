export type ShapeType = 'rectangle' | 'circle' | 'line' | 'ellipse'

export type Tool = ShapeType | 'select'

export type AnimationType = 'rotate' | 'scale' | 'fade' | 'translate'

export interface Animation {
  type: AnimationType
  duration: number
  loop: boolean
}

export interface AnimationTrack {
  id: number
  type: AnimationType
  startTime: number
  duration: number
  values: {
    from?: number | string
    to?: number | string
    x?: number
    y?: number
  }
  freeze?: boolean
  repeat?: boolean
}

export interface Shape {
  id: number
  type: ShapeType
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  radiusX?: number
  radiusY?: number
  x2?: number
  y2?: number
  fill: string
  stroke?: string
  strokeWidth?: number
  animation?: Animation
  animations?: AnimationTrack[]
  totalDuration?: number
}
