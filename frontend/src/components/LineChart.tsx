import React from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import { colors } from '../theme/colors'
import { BorderRadius } from '../theme/styles'

type LineChartProps = {
  actives: { time: string; value: number; value2?: number }[]
  maxY: number
  labelName: string
  width?: string
  height?: string
  formatter?: (value, name?, props?) => string | [string, string]
}

export function LineChart(props: LineChartProps) {
  const { actives, maxY, labelName, width = '400px', height = '200px', formatter } = props
  return (
    <ChartCss style={{ height: height, width: width }}>
      <div>{labelName}</div>
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
            domain={[0, maxY]}
            axisLine={{ stroke: colors.primary }}
            tickLine={{ stroke: colors.primary }}
            tick={{ strokeWidth: '0.1', fill: colors.primary, stroke: colors.primary }}
          />
          <Tooltip formatter={formatter} contentStyle={{ backgroundColor: colors.background }} />

          <Area type='linear' dataKey='value2' stroke='#ffff33' fill='RGBA(255,255,51,0.2)' />
          <Area type='linear' dataKey='value' stroke={colors.blue} fill={colors.blue} />
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
