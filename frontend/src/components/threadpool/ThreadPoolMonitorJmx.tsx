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

export function ThreadPoolMonitorJmx(props: ThreadPoolMonitorProps) {
  const { id, requestPoolName } = props
  const [corePool, setCorePool] = useState<number>(0)
  const [actives, setActives] = useState<{ time: string; value: number }[]>([
    { time: moment(moment.now()).format('HH:mm:ss'), value: 0 },
  ])

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      api.jmx.post(id,  {
        mbean: requestPoolName,
        type: 'read',
        config: { ignoreErrors: true },
      })
      .then(({ data }) => {
        setCorePool(data?.value?.CoreWorkerPoolSize)
        
        setActives(oldActives => {
          if (oldActives.length >= 100) {
            oldActives.shift()
          }
          return [
            ...oldActives,
            {
              time: moment(moment.now()).format('HH:mm:ss'),
              value: data?.value?.BusyWorkerThreadCount,
            },
          ]
        })
      }).catch(({data}) => {console.log('erro')})
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [id, requestPoolName])

  return <ThreadPoolMonitor {...props} actives={actives} corePool={corePool} />
}
