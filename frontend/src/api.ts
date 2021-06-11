import axios, { AxiosInstance, AxiosPromise } from 'axios'

interface AxiosInstanceInternal extends AxiosInstance {
  redirectGet(id: string, path: string): AxiosPromise
}

const api: AxiosInstanceInternal = {
  ...axios.create({
    baseURL: 'http://localhost:8000',
  }),
  redirectGet: (id: string, path: string) =>
    api.get(`/redirect/instances/${id}`, {
      params: {
        path: path,
      },
    }),
}

export default api
