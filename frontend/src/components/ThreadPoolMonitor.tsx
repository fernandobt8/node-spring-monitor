import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import api from '../api'

type ThreadPoolMonitorProps = {
  id: string
  labelPoolName: string
  requestPoolName: string
  width?: string
  height?: string
}

export default function ThreadPoolMonitor({ id, labelPoolName, requestPoolName, width = '440px', height = '200px' }: ThreadPoolMonitorProps) {
  const [corePool, setCorePool] = useState<number>(0)
  const [actives, setActives] = useState<{ time: string; value: number }[]>([{ time: moment(moment.now()).format('HH:mm:ss'), value: 0 }])

  useEffect(() => {
    api
      .get(`/redirect/instances/${id}`, {
        params: {
          path: `metrics/${requestPoolName}?tag=prop:core-pool`,
        },
      })
      .then(({ data }) => setCorePool(data?.measurements[0]?.value))
  }, [id, requestPoolName])

  useEffect(() => {
    let timer = setInterval(() => {
      api
        .get(`/redirect/instances/${id}`, {
          params: {
            path: `metrics/${requestPoolName}?tag=prop:active`,
          },
        })
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
        })
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [id, requestPoolName])

  return (
    <ChartCss style={{ height: height, width: width }}>
      <div>{labelPoolName}</div>
      <ResponsiveContainer width='100%' height='100%'>
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
          <CartesianGrid strokeDasharray='3 3' stroke='#eee' />
          <XAxis
            dataKey='time'
            axisLine={{ stroke: '#eee' }}
            tickLine={{ stroke: '#eee' }}
            tick={{
              strokeWidth: '0.1',
              fill: '#eee',
              stroke: '#eee',
              fontSize: '12px',
            }}
          />
          <YAxis
            domain={[0, corePool]}
            axisLine={{ stroke: '#eee' }}
            tickLine={{ stroke: '#eee' }}
            tick={{ strokeWidth: '0.1', fill: '#eee', stroke: '#eee' }}
          />
          <Tooltip />
          <Area type='linear' dataKey='value' stroke='#50D0F6' fill='#50D0F6' />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCss>
  )
}

const ChartCss = styled.div`
  border: 2px solid ${props => props.theme.primaryColor};
  border-radius: 5px;
  text-align: center;
  padding: 10px 0px 20px 0px;

  > .recharts-responsive-container {
    margin-left: -10px;
    background-color: transparent;
  }
`
