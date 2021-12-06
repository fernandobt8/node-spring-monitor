import { AxiosResponse, CancelToken } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { LineChart } from '../../components/LineChart'
import { useActivesInterval } from '../../hooks/useActivesInterval'
import { InstanceParams } from '../InstanceMenu'

const GB = 1024 * 1024 * 1024

const valueFor = (v: number) => (v / GB).fixed(2)
const formatMemory = (v: number, name: string): [string, string] => [`${v}GB`, name === 'value' ? 'used' : 'size']

export function MemoryLineChart() {
  const { id } = useParams<InstanceParams>()
  const [maxY, setMaxY] = useState<number>(0)

  // prettier-ignores
  useEffect(() => {
    api.metrics.get(id, 'jvm.memory.max', ['area:heap']).then(({ data }) => setMaxY(valueFor(data?.measurements[0]?.value)))
  }, [id])

  const apiMetrics = useCallback(
    (cancelToken: CancelToken) => [
      api.metrics.get(id, 'jvm.memory.used', ['area:heap'], cancelToken),
      api.metrics.get(id, 'jvm.memory.committed', ['area:heap'], cancelToken),
    ],
    [id]
  )
  const onResponse = useCallback(
    (responses: AxiosResponse[]) => ({
      value: valueFor(responses[0].data?.measurements[0]?.value),
      value2: valueFor(responses[1].data?.measurements[0]?.value),
    }),
    []
  )

  const actives = useActivesInterval(apiMetrics, onResponse)

  return <LineChart labelName='Memory' formatter={formatMemory} actives={actives} maxY={maxY} />
}
