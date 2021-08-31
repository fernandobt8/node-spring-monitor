import React from 'react'
import { useParams } from 'react-router'
import { FlexBox } from '../../components/FlexBox'
import { ThreadPoolMonitorMetrics } from '../../components/threadpool/ThreadPoolMonitorMetrics'
import { ThreadPoolMonitorJmx } from '../../components/threadpool/ThreadPoolMonitorJmx'
import { InstanceParams } from '../InstanceMenu'

export function Geral() {
  const { id } = useParams<InstanceParams>()

  // prettier-ignore
  return (
    <FlexBox justifyContent='flex-start'>
      <ThreadPoolMonitorJmx id={id} labelPoolName='XNIO-1 task' requestPoolName='org.xnio:provider="nio",type=Xnio,worker="XNIO-1"' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Small Task' requestPoolName='pec.pool.small-task' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Integração' requestPoolName='pec.pool.integracao-http-nio' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='MPI' requestPoolName='pec.pool.app-mpi' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Horus' requestPoolName='pec.pool.app-horus' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Relatório' requestPoolName='pec.pool.app-report' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Atmosphere AsyncOp' requestPoolName='pec.pool.atmosphere-async-write' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Atmosphere DispatchOp' requestPoolName='pec.pool.atmosphere-broadcaster' />
      <ThreadPoolMonitorMetrics id={id} labelPoolName='Atmosphere Schedule' requestPoolName='pec.pool.atmosphere-scheduled' />
    </FlexBox>
  )
}
