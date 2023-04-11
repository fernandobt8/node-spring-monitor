import React from 'react'
import { MemoryBarChart } from '../../components/BarChart'
import { FlexBox } from '../../components/FlexBox'
import { LineChartMetrics } from './LineChartMetrics'
import { MemoryLineChart } from './MemoryLineChart'
import { ProcessMetrics } from './ProcessMetrics'
import { ThreadPoolMonitorJmx } from './ThreadPoolMonitorJmx'

export function Geral() {
  // prettier-ignore
  return (
    <FlexBox justifyContent='flex-start'>
      <ProcessMetrics />
      <MemoryLineChart />
      <MemoryBarChart />
      <ThreadPoolMonitorJmx  labelName='XNIO-1 task' requestPoolName='org.xnio:provider="nio",type=Xnio,worker="XNIO-1"' />
      <ThreadPoolMonitorMetrics  labelPoolName='Small Task' requestPoolName='pec.pool.small-task' />
      <ThreadPoolMonitorMetrics  labelPoolName='Integração' requestPoolName='pec.pool.integracao-http-nio' />
      <ThreadPoolMonitorMetrics  labelPoolName='MPI' requestPoolName='pec.pool.app-mpi' />
      <ThreadPoolMonitorMetrics  labelPoolName='Horus' requestPoolName='pec.pool.app-horus' />
      <ThreadPoolMonitorMetrics  labelPoolName='Relatório' requestPoolName='pec.pool.app-report' />
      <ThreadPoolMonitorMetrics  labelPoolName='Atmosphere AsyncOp' requestPoolName='pec.pool.atmosphere-async-write' />
      <ThreadPoolMonitorMetrics  labelPoolName='Atmosphere DispatchOp' requestPoolName='pec.pool.atmosphere-broadcaster' />
      <ThreadPoolMonitorMetrics  labelPoolName='Atmosphere Schedule' requestPoolName='pec.pool.atmosphere-scheduled' />
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
