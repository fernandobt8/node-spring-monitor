import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { LineChart } from '../../components/LineChart'
import { InstanceParams } from '../InstanceMenu'

const valueFor = (v: number) => v.fixed(2)
const formatMemory = (v: number, name: string): [string, string] => [`${v}`, name === 'value' ? 'process' : 'system']

export function ProcessMetrics() {
  const { id } = useParams<InstanceParams>()
  const [cpuCount, setCpuCount] = useState<number>(0)
  const [actives, setActives] = useState<{ time: string; value: number; value2: number }[]>([
    { time: moment(moment.now()).format('HH:mm:ss'), value: 0, value2: 0 },
  ])

  useEffect(() => {
    api.metrics(id, 'system.cpu.count').then(({ data }) => setCpuCount(data?.measurements[0]?.value))
  }, [id])

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      Promise.all([api.metrics(id, 'process.cpu.usage'), 
        api.metrics(id, 'system.cpu.usage')])
      .then(responses => {
        setActives(oldActives => {
          if (oldActives.length >= 100) {
            oldActives.shift()
          }
          return [
            ...oldActives,
            {
              time: moment(moment.now()).format('HH:mm:ss'),
              value: valueFor(responses[0].data?.measurements[0]?.value),
              value2: valueFor(responses[1].data?.measurements[0]?.value),
            },
          ]
        })
      }).catch(({data}) => {console.log('erro')})
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [id])

  return <LineChart labelName={`CPU: ${cpuCount}`} formatter={formatMemory} actives={actives} maxY={1} />
}
