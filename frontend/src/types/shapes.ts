export interface Shape {
  id: number
  type: 'rectangle' | 'circle' | 'line'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  x2?: number
  y2?: number
  fill: string
}
