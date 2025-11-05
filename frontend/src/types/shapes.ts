export type ShapeType = 'rectangle' | 'circle' | 'line'

export interface Shape {
  id: number
  type: ShapeType
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  x2?: number
  y2?: number
  fill: string
}
