export interface ProjectResponse {
  id: number
  title: string
  lastShapesData: string
  createdAt: string
  updatedAt: string
}

export interface ProjectRequest {
  title: string
}

export interface SnapshotResponse {
  id: number
  projectId: number
  shapesData: string
  createdAt: string
}

export interface SnapshotRequest {
  shapesData: string
}

export interface ProjectWithSnapshotsResponse extends ProjectResponse {
  snapshots: SnapshotResponse[]
}