import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import api from '../api'
import { colors } from '../theme/colors'
import { BorderRadius } from '../theme/styles'

type ThreadPoolMonitorProps = {
  id: string
  labelPoolName: string
  requestPoolName: string
  width?: string
  height?: string
}

export function ThreadPoolMonitor({
  id,
  labelPoolName,
  requestPoolName,
  width = '440px',
  height = '200px',
}: ThreadPoolMonitorProps) {
  const [corePool, setCorePool] = useState<number>(0)
  const [actives, setActives] = useState<{ time: string; value: number }[]>([
    { time: moment(moment.now()).format('HH:mm:ss'), value: 0 },
  ])

  // prettier-ignore
  useEffect(() => {
    api.redirectGet(id, `metrics/${requestPoolName}?tag=prop:core-pool`)
      .then(({ data }) => setCorePool(data?.measurements[0]?.value))
  }, [id, requestPoolName])

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      api.redirectGet(id, `metrics/${requestPoolName}?tag=prop:active`)
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
  }, [id, requestPoolName])

  return (
    <ChartCss style={{ height: height, width: width }}>
      <div>{labelPoolName}</div>
      <ResponsiveContainerStyle width='100%' height='100%'>
        <AreaChart
          width={500}
          height={400}
          data={actives}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}>
          <CartesianGrid strokeDasharray='3 3' stroke={colors.primary} />
          <XAxis
            dataKey='time'
            axisLine={{ stroke: colors.primary }}
            tickLine={{ stroke: colors.primary }}
            tick={{
              strokeWidth: '0.1',
              fill: colors.primary,
              stroke: colors.primary,
              fontSize: '12px',
            }}
          />
          <YAxis
            domain={[0, corePool]}
            axisLine={{ stroke: colors.primary }}
            tickLine={{ stroke: colors.primary }}
            tick={{ strokeWidth: '0.1', fill: colors.primary, stroke: colors.primary }}
          />
          <Tooltip />
          <Area type='linear' dataKey='value' stroke='#50D0F6' fill='#50D0F6' />
        </AreaChart>
      </ResponsiveContainerStyle>
    </ChartCss>
  )
}

const ResponsiveContainerStyle = styled(ResponsiveContainer)`
  margin-left: -10px;
  background-color: transparent;
`

const ChartCss = styled.div`
  ${BorderRadius}
  padding: 10px 0px 20px 0px;
`
