export type ShapeType = 'rectangle' | 'circle' | 'line' | 'ellipse'

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
}
