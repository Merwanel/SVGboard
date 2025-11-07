import axios, { type AxiosInstance, type AxiosError } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      const message = (error.response.data as { message?: string })?.message || error.message

      console.error(`API Error ${status}:`, message)

      switch (status) {
        case 404:
          console.error('Resource not found')
          break
        case 400:
          console.error('Bad request:', message)
          break
        case 500:
          console.error('Server error:', message)
          break
      }
    } else if (error.request) {
      console.error('No response from server:', error.message)
    } else {
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

export function useApi() {
  return {
    client: apiClient,
    baseURL: BASE_URL
  }
}

export { apiClient }
