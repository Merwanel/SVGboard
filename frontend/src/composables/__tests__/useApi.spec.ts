import { describe, it, expect } from 'vitest'
import { useApi } from '../useApi'

describe('useApi', () => {
  it('should return configured axios client', () => {
    const { client, baseURL } = useApi()

    expect(client).toBeDefined()
    expect(baseURL).toBe('http://localhost:8080')
  })
})
