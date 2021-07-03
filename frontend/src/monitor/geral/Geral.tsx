import React from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { ThreadPoolMonitor } from '../../components/ThreadPoolMonitor'
import { InstaceParams } from '../InstanceMenu'

export function Geral() {
  const { id } = useParams<InstaceParams>()

  return (
    <Container justifyContent='flex-start'>
      <ThreadPoolMonitor id={id} labelPoolName='HTTP' requestPoolName='pec.pool.app-http-nio' />
      <ThreadPoolMonitor id={id} labelPoolName='Android' requestPoolName='pec.pool.android-http-nio' />
      <ThreadPoolMonitor id={id} labelPoolName='MPI' requestPoolName='pec.pool.app-mpi' />
      <ThreadPoolMonitor id={id} labelPoolName='Horus' requestPoolName='pec.pool.app-horus' />
      <ThreadPoolMonitor id={id} labelPoolName='Relatório' requestPoolName='pec.pool.app-report' />
      <ThreadPoolMonitor id={id} labelPoolName='Atmosphere async write' requestPoolName='pec.pool.atmosphere-async-write' />
      <ThreadPoolMonitor id={id} labelPoolName='Atmosphere broadcaster' requestPoolName='pec.pool.atmosphere-broadcaster' />
      <ThreadPoolMonitor id={id} labelPoolName='Atmosphere schedule' requestPoolName='pec.pool.atmosphere-scheduled' />
    </Container>
  )
}

const Container = styled(FlexBox)<FlexBoxProps>`
  padding: 20px;
`
