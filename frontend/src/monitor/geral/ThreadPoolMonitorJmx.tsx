import { AxiosResponse, CancelToken } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { LineChart } from '../../components/LineChart'
import { useActivesInterval } from '../../hooks/useActivesInterval'
import { InstanceParams } from '../InstanceMenu'

type ThreadPoolMonitorProps = {
  labelName: string
  requestPoolName: string
  width?: string
  height?: string
}

export function ThreadPoolMonitorJmx(props: ThreadPoolMonitorProps) {
  const { id } = useParams<InstanceParams>()
  const { requestPoolName } = props
  const [corePool, setCorePool] = useState<number>(0)

  const apiMetrics = useCallback(
    (cancelToken: CancelToken) => [
      api.jmx.post(
        id,
        {
          mbean: requestPoolName,
          type: 'read',
          config: { ignoreErrors: true },
        },
        cancelToken
      ),
    ],
    [id, requestPoolName]
  )

  useEffect(() => {
    apiMetrics(undefined)[0]
      .then(({ data }) => {
        setCorePool(data?.value?.CoreWorkerPoolSize)
      })
      .catch(({ data }) => {
        console.log('erro')
      })
  }, [apiMetrics])

  const onResponse = useCallback((responses: AxiosResponse[]) => ({ value: responses[0].data?.value?.BusyWorkerThreadCount }), [])

  const actives = useActivesInterval(apiMetrics, onResponse)

  return (
    <LineChart {...props} actives={actives} maxY={corePool} formatter={(v: number): [string, string] => [`${v}`, 'actives']} />
  )
}
