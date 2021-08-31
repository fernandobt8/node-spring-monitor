import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import { colors } from '../../theme/colors'
import { BorderRadius } from '../../theme/styles'

type ThreadPoolMonitorProps = {
  actives: { time: string; value: number }[]
  corePool: number
  labelPoolName: string
  width?: string
  height?: string
}

export function ThreadPoolMonitor(props: ThreadPoolMonitorProps) {
  const { actives, corePool, labelPoolName, width = '400px', height = '200px' } = props
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
