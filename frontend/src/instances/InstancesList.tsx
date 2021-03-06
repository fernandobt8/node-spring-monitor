import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../api'
import { FlexBox, FlexBoxProps } from '../components/FlexBox'
import { InstancesTable } from './InstancesTable'

export type InstanceStatus = 'CONNECTED' | 'DOWN'

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

export default function InstancesList() {
  const [data, setData] = useState<InstanceDTO[]>([])

  useEffect(() => {
    api.instances().then(({ data }) => {
      setData(data?.sort((a, b) => (a.name > b.name ? 1 : -1)))
    })
  }, [])

  return (
    <>
      <Header gap={60}>
        <ItemHeader label='Applications' value={new Set(data.map(i => i.name)).size} />
        <ItemHeader label='Instances' value={data.length} />
        <ItemHeader label='Instances down' value={data.filter(i => i.status === 'DOWN').length} />
      </Header>
      <InstancesTable instances={data} />
    </>
  )
}

function ItemHeader({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <h3>{label}</h3>
      <h3>{value || 0}</h3>
    </div>
  )
}

const Header = styled(FlexBox)<FlexBoxProps>`
  padding: 20px 0px;
`
