import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { InstanceParams } from '../InstanceMenu'
import { LineChart } from '../../components/LineChart'

const GB = 1024 * 1024 * 1024

const valueFor = (v: number) => (v / GB).fixed(2)
const formatMemory = (v: number, name: string): [string, string] => [`${v}GB`, name === 'value' ? 'used' : 'size']

export function MemoryLineChart() {
  const { id } = useParams<InstanceParams>()
  const [maxY, setMaxY] = useState<number>(0)
  const [actives, setActives] = useState<{ time: string; value: number; value2: number }[]>([
    { time: moment(moment.now()).format('HH:mm:ss'), value: 0, value2: 0 },
  ])

  // prettier-ignores
  useEffect(() => {
    api.metrics(id, 'jvm.memory.max', 'area:heap').then(({ data }) => setMaxY(valueFor(data?.measurements[0]?.value)))
  }, [id])

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      Promise.all([api.metrics(id, 'jvm.memory.used', 'area:heap'), 
        api.metrics(id, 'jvm.memory.committed', 'area:heap')])
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

  return <LineChart labelName='Memory' formatter={formatMemory} actives={actives} maxY={maxY} />
}
