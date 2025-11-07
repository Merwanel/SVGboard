import { type Ref } from 'vue'

export function createErrorHandler(errorRef: Ref<string | null>) {
  return (err: unknown, fallback: string): never => {
    errorRef.value = err instanceof Error ? err.message : fallback
    throw err
  }
}
