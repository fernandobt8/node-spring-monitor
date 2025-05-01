import React from 'react'
import { MemoryBarChart } from '../../components/BarChart'
import { FlexBox } from '../../components/FlexBox'
import { LineChartMetrics } from './LineChartMetrics'
import { MemoryLineChart } from './MemoryLineChart'
import { ProcessMetrics } from './ProcessMetrics'
import { ThreadPoolMonitorJmx } from './ThreadPoolMonitorJmx'
import { useInstanceDto } from '../InstanceContext'

export function Geral() {
  const { name } = useInstanceDto()

  return (
    <FlexBox justifyContent='flex-start'>
      <ProcessMetrics />
      <MemoryLineChart />
      <MemoryBarChart />
      <ThreadPoolMonitorJmx labelName='HTTP' requestPoolName='Tomcat:name="http-nio-9000",type=ThreadPool' />

      {name === 'mi-api' && (
        <>
          <ThreadPoolMonitorMetrics labelPoolName='Async' requestPoolName='ps.pool.async' />
          <ThreadPoolMonitorMetrics labelPoolName='Batch Loader' requestPoolName='ps.pool.batch-loader' />
        </>
      )}
    </FlexBox>
  )
}

const formatThread = (v: number): [string, string] => [`${v}`, 'actives']

function ThreadPoolMonitorMetrics({ labelPoolName, requestPoolName }) {
  return (
    <LineChartMetrics
      labelName={labelPoolName}
      metric={requestPoolName}
      metricYtag='prop:core-pool'
      metricXtag='prop:active'
      formatter={formatThread}
    />
  )
}
