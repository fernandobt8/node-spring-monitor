import { AxiosResponse, CancelToken } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { LineChart } from '../../components/LineChart'
import { useActivesInterval } from '../../hooks/useActivesInterval'
import { InstanceParams } from '../InstanceMenu'

type LineChartProps = {
  labelName: string
  metric: string
  metricYtag: string
  metricXtag: string
  width?: string
  height?: string
  formatter?: (value, name?, props?) => string | [string, string]
}

export function LineChartMetrics(props: LineChartProps) {
  const { id } = useParams<InstanceParams>()
  const { metric, metricYtag, metricXtag } = props
  const [maxY, setMaxY] = useState<number>(0)

  // prettier-ignore
  useEffect(() => {
    api.metrics.get(id, metric, [metricYtag])
      .then(({ data }) => setMaxY(data?.measurements[0]?.value))
  }, [id, metric, metricYtag])

  const apiMetrics = useCallback(
    (cancelToken: CancelToken) => [api.metrics.get(id, metric, [metricXtag], cancelToken)],
    [id, metric, metricXtag]
  )
  const onResponse = useCallback((response: AxiosResponse[]) => ({ value: response[0].data?.measurements[0]?.value }), [])

  const actives = useActivesInterval(apiMetrics, onResponse)

  return <LineChart {...props} actives={actives} maxY={maxY} />
}
