import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'

interface AxiosInstanceInternal extends AxiosInstance {
  redirectGet(id: string, path: string, others?: any, config?: AxiosRequestConfig): AxiosPromise
  redirectPost(id: string, path: string, data: any, config?: AxiosRequestConfig): AxiosPromise
}

export const api: AxiosInstanceInternal = {
  ...axios.create(),
  redirectGet: (id: string, path: string, headers?: any, config?: AxiosRequestConfig) =>
    api.get(`/api/redirect/instances/${id}`, {
      ...config,
      params: {
        path: path,
        headers,
        ...config?.params,
      },
    }),
  redirectPost: (id: string, path: string, data: any, config?: AxiosRequestConfig) =>
    api.post(`/api/redirect/instances/${id}`, data, {
      ...config,
      params: {
        path: path,
        ...config?.params,
      },
    }),
}

const transformResponse = [].concat(axios.defaults.transformResponse, data => data?.body)

const jmx = {
  list: (id: string) => api.redirectGet(id, 'jolokia/list', { Accept: 'application/json' }, { transformResponse }),

  post: (id: string, mBeanDTO: any) => api.redirectPost(id, `jolokia`, mBeanDTO, {}),
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  metrics: (id: string, name: string, ...tags: string[]) =>
    api.redirectGet(id, `metrics/${name}?tag=${tags.join('&tag=')}`, {}, { transformResponse }),

  env: (id: string) => api.redirectGet(id, 'env', {}, { transformResponse }),

  configProps: (id: string) => api.redirectGet(id, 'configprops', {}, { transformResponse }),

  logFile: (id: string, headers: any) => api.redirectGet(id, 'logfile', headers),

  threadDump: (id: string) => api.redirectGet(id, `threaddump`, { Accept: 'application/json' }, { transformResponse }),

  jmx: jmx,

  instance: (id: string) => api.get(`/api/instances/${id}`),

  instances: () => api.get('/api/instances'),
}
