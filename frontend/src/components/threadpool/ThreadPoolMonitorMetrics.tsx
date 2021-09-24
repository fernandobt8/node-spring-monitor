import moment from 'moment'
import React, { useEffect, useState } from 'react'
import api from '../../api'
import { ThreadPoolMonitor } from './ThreadPoolMonitor'

type ThreadPoolMonitorProps = {
  id: string
  labelPoolName: string
  requestPoolName: string
  width?: string
  height?: string
}

export function ThreadPoolMonitorMetrics(props: ThreadPoolMonitorProps) {
  const { id, requestPoolName } = props
  const [corePool, setCorePool] = useState<number>(0)
  const [actives, setActives] = useState<{ time: string; value: number }[]>([
    { time: moment(moment.now()).format('HH:mm:ss'), value: 0 },
  ])

  // prettier-ignore
  useEffect(() => {
    api.metrics(id, requestPoolName, 'prop:core-pool')
      .then(({ data }) => setCorePool(data?.measurements[0]?.value))
  }, [id, requestPoolName])

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      api.metrics(id, requestPoolName, 'prop:active')
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

  return <ThreadPoolMonitor {...props} actives={actives} corePool={corePool} />
}
