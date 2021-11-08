import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'
import api from '../api'
import { InstanceParams } from '../monitor/InstanceMenu'
import { colors } from '../theme/colors'
import { BorderRadius } from '../theme/styles'

const MB = 1024 * 1024

type DataDto = {
  name: string
  desc: string
  used?: number
  max?: number
}

const names = [
  { name: 'Metaspace', desc: 'Meta' },
  { name: 'Code Cache', desc: 'Code Cache' },
  { name: 'Compressed Class Space', desc: 'Comp Class' },
]

export function MemoryBarChart() {
  const { id } = useParams<InstanceParams>()
  const [data, setData] = useState<DataDto[]>(names)
  const [dataN, setDataN] = useState<DataDto[]>(data)

  useEffect(() => {
    names.forEach(({ name }, index) =>
      api.metrics(id, 'jvm.memory.used', ['area:nonheap', `id:${name}`]).then(({ data }) =>
        setData(oldData => {
          const newData = [...oldData]
          newData[index] = { ...newData[index], used: Number(data?.measurements[0]?.value / MB).fixed(2) }
          return newData
        })
      )
    )

    names.forEach(({ name }, index) =>
      api.metrics(id, 'jvm.memory.max', ['area:nonheap', `id:${name}`]).then(({ data }) =>
        setData(oldData => {
          const newData = [...oldData]
          newData[index] = { ...newData[index], max: data?.measurements[0]?.value / MB }
          return newData
        })
      )
    )
  }, [id])

  useEffect(() => {
    const dataN: Array<DataDto> = []
    data.forEach(v => {
      if (v.max && v.used) dataN.push({ ...v, max: v.max - v.used })
      else dataN.push({ ...v })
    })
    setDataN(dataN)
  }, [data])

  return (
    <ChartCss style={{ height: '220px', width: '400px' }}>
      <div>NonHeap</div>
      <ResponsiveContainerStyle width='100%' height='100%'>
        <BarChart
          width={500}
          height={400}
          data={dataN}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 20,
          }}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='desc'
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
            axisLine={{ stroke: colors.primary }}
            tickLine={{ stroke: colors.primary }}
            tick={{ strokeWidth: '0.1', fill: colors.primary, stroke: colors.primary }}
          />
          <Tooltip
            formatter={(value, name, props) => (name === 'max' ? value + props.payload.used : value) + 'MB'}
            cursor={false}
            contentStyle={{ backgroundColor: colors.background }}
          />

          <Bar dataKey='used' stackId='a' fill='#50D0F6'>
            {data.map((entry, index) => (
              <Cell key={`used-${index}`} fill='RGBA(80,208,246,0.75)' />
            ))}
          </Bar>

          <Bar dataKey='max' stackId='a' fill='#82ca9d'>
            {data.map((entry, index) => (
              <Cell key={`max-${index}`} fill='RGBA(80,208,246,0.15)' />
            ))}
          </Bar>
        </BarChart>
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
  padding: 10px 0px 0px 0px;
`
