import { AxiosResponse } from 'axios'
import { useEffect } from 'react'
import { api } from '../api'

export default function useAxiosAuthInterceptor(unauthorized: (res?: AxiosResponse) => void) {
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      response => response,
      error => {
        if (401 === error.response.status) {
          unauthorized(error.response)
          return Promise.resolve({ data: null })
        } else {
          return Promise.reject(error)
        }
      }
    )
    return () => api.interceptors.response.eject(interceptorId)
  }, [unauthorized])
}
