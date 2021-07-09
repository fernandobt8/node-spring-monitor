import React from 'react'
import { useParams } from 'react-router'
import { FlexBox } from '../../components/FlexBox'
import { ThreadPoolMonitor } from '../../components/ThreadPoolMonitor'
import { InstanceParams } from '../InstanceMenu'

export function Geral() {
  const { id } = useParams<InstanceParams>()

  return (
    <FlexBox justifyContent='flex-start'>
      <ThreadPoolMonitor id={id} labelPoolName='HTTP' requestPoolName='pec.pool.app-http-nio' />
      <ThreadPoolMonitor id={id} labelPoolName='Android' requestPoolName='pec.pool.android-http-nio' />
      <ThreadPoolMonitor id={id} labelPoolName='MPI' requestPoolName='pec.pool.app-mpi' />
      <ThreadPoolMonitor id={id} labelPoolName='Horus' requestPoolName='pec.pool.app-horus' />
      <ThreadPoolMonitor id={id} labelPoolName='Relatório' requestPoolName='pec.pool.app-report' />
      <ThreadPoolMonitor id={id} labelPoolName='Atmosphere async write' requestPoolName='pec.pool.atmosphere-async-write' />
      <ThreadPoolMonitor id={id} labelPoolName='Atmosphere broadcaster' requestPoolName='pec.pool.atmosphere-broadcaster' />
      <ThreadPoolMonitor id={id} labelPoolName='Atmosphere schedule' requestPoolName='pec.pool.atmosphere-scheduled' />
    </FlexBox>
  )
}
