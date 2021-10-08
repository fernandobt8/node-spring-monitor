import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { InstanceParams } from '../InstanceMenu'
import { LineChart } from '../../components/LineChart'

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
  const [actives, setActives] = useState<{ time: string; value: number }[]>([
    { time: moment(moment.now()).format('HH:mm:ss'), value: 0 },
  ])

  // prettier-ignore
  useEffect(() => {
    api.metrics(id, metric, metricYtag)
      .then(({ data }) => setMaxY(data?.measurements[0]?.value))
  }, [id, metric, metricYtag])

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      api.metrics(id, metric, metricXtag)
      .then(({ data }) => {
        setActives(oldActives => {
          if (oldActives.length >= 100) {
            oldActives.shift()
          }
          return [
            ...oldActives,
            {
              time: moment(moment.now()).format('HH:mm:ss'),
              value: data?.measurements[0]?.value,
            },
          ]
        })
      }).catch(({data}) => {console.log('erro')})
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [id, metric, metricXtag])

  return <LineChart {...props} actives={actives} maxY={maxY} />
}
