import axios, { AxiosInstance, AxiosPromise } from 'axios'

interface AxiosInstanceInternal extends AxiosInstance {
  redirectGet(id: string, path: string, others?: any): AxiosPromise
}

const api: AxiosInstanceInternal = {
  ...axios.create({
    baseURL: 'http://localhost:8000',
  }),
  redirectGet: (id: string, path: string, others?: any) =>
    api.get(`/redirect/instances/${id}`, {
      params: {
        path: path,
      },
      ...others,
    }),
}

export default api
