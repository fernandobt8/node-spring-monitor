import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../api'
import InstancesTable from './InstancesTable'

enum InstanceStatus {
  CONNECTED = 'CONNECTED',
  DOWN = 'DOWN',
}

export type InstanceDTO = {
  id: string
  name: string
  managementUrl: string
  healthUrl: string
  serviceUrl: string
  metadata: {
    'user.name': string
    'user.password': string
    startup: string
  }
  status: InstanceStatus
  version: string
  sessions: number
  uptime: number
}

export function InstancesList() {
  const [data, setData] = useState<InstanceDTO[]>([])

  useEffect(() => {
    api.get('/instances').then(result => {
      setData(result.data)
    })
  }, [])

  return (
    <Container>
      <Header>
        <ItemHeader label='Applications' value={new Set(data.map(i => i.name)).size} />
        <ItemHeader label='Instances' value={data.length} />
        <ItemHeader label='Instances down' value={data.filter(i => i.status === InstanceStatus.DOWN).length} />
      </Header>
      <InstancesTable instances={data} />
    </Container>
  )
}

type ItemHeaderProps = { label: string; value?: number }

function ItemHeader({ label, value }: ItemHeaderProps) {
  return (
    <div>
      <HeaderLabel>{label}</HeaderLabel>
      <HeaderLabel>{value || 0}</HeaderLabel>
    </div>
  )
}

const Container = styled.div`
  text-align: center;
`

const Header = styled.div`
  padding: 50px 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 60px;
`

const HeaderLabel = styled.h3`
  margin: 0px;
`

export default InstancesList
