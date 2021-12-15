import axios, { AxiosRequestConfig, CancelToken } from 'axios'

export const api = axios.create()

function redirectGet(id: string, path: string, headers?: any, config?: AxiosRequestConfig) {
  return api.get(`/api/redirect/instances/${id}`, {
    ...config,
    params: {
      path: path,
      headers,
      ...config?.params,
    },
  })
}
function redirectPost(id: string, path: string, data: any, config?: AxiosRequestConfig) {
  return api.post(`/api/redirect/instances/${id}`, data, {
    ...config,
    params: {
      path: path,
      ...config?.params,
    },
  })
}

const transformResponse = [].concat(axios.defaults.transformResponse, data => data?.body)

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  metrics: {
    get: (id: string, name: string, tags?: string[], cancelToken?: CancelToken) =>
      redirectGet(id, `metrics/${name}${tags ? `?tag=${tags.join('&tag=')}` : ''}`, {}, { transformResponse, cancelToken }),

    list: (id: string) => redirectGet(id, 'metrics', {}, { transformResponse }),
  },

  env: (id: string) => redirectGet(id, 'env', {}, { transformResponse }),

  configProps: (id: string) => redirectGet(id, 'configprops', {}, { transformResponse }),

  logFile: (id: string, headers: any) => redirectGet(id, 'logfile', headers),

  threadDump: (id: string) => redirectGet(id, `threaddump`, { Accept: 'application/json' }, { transformResponse }),

  jmx: {
    list: (id: string) => redirectGet(id, 'jolokia/list', { Accept: 'application/json' }, { transformResponse }),

    post: (id: string, mBeanDTO: any, cancelToken?: CancelToken) => redirectPost(id, `jolokia`, mBeanDTO, { cancelToken }),
  },

  instance: {
    get: (id: string) => api.get(`/api/instances/${id}`),

    list: (filter?, order?) => api.post('/api/instances', { filter, order }),

    aggregate: () => api.get('/api/instances/aggregate'),

    delete: (id: string) => api.delete(`/api/instances/${id}`),
  },
}
