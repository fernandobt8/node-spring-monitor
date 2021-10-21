import { AxiosResponse } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { LineChart } from '../../components/LineChart'
import { useActivesInterval } from '../../hooks/useActivesInterval'
import { InstanceParams } from '../InstanceMenu'

const valueFor = (v: number) => v.fixed(2)
const formatMemory = (v: number, name: string): [string, string] => [`${v}`, name === 'value' ? 'process' : 'system']

export function ProcessMetrics() {
  const { id } = useParams<InstanceParams>()
  const [cpuCount, setCpuCount] = useState<number>(0)

  useEffect(() => {
    api.metrics(id, 'system.cpu.count').then(({ data }) => setCpuCount(data?.measurements[0]?.value))
  }, [id])

  const apiMetrics = useCallback(() => [api.metrics(id, 'process.cpu.usage'), api.metrics(id, 'system.cpu.usage')], [id])
  const onResponse = useCallback(
    (responses: AxiosResponse[]) => ({
      value: valueFor(responses[0].data?.measurements[0]?.value),
      value2: valueFor(responses[1].data?.measurements[0]?.value),
    }),
    []
  )

  const actives = useActivesInterval(apiMetrics, onResponse)

  return <LineChart labelName={`CPU: ${cpuCount}`} formatter={formatMemory} actives={actives} maxY={1} />
}