import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import api from '../api'
import { FlexBox, FlexBoxProps } from '../components/FlexBox'
import { Input } from '../components/Input'
import { Label } from '../components/Label'
import { queries } from '../theme/theme'
import { InstancesTable } from './InstancesTable'

export type InstanceStatus = 'CONNECTED' | 'DOWN'

export type InstanceDTO = {
  _id: string
  name: string
  managementUrl: string
  healthUrl: string
  serviceUrl: string
  status: InstanceStatus
  version: string
  sessions: number
  uptime: number
}

type OrderDto = {
  fieldOrder: string[]
}

export default function InstancesList() {
  const [data, setData] = useState<InstanceDTO[]>([])
  const [aggregate, setAggregate] = useState<{ applications; instances; downs }>()
  const [filter, setFilter] = useState<{ status? }>({})
  const [order, setOrder] = useState<OrderDto>({ fieldOrder: [] })

  useEffect(() => {
    api.instance.list(filter, order).then(({ data }) => {
      setData(data)
    })
  }, [filter, order])

  useEffect(() => {
    api.instance.aggregate().then(({ data }) => {
      setAggregate(data)
    })
  }, [])

  function onChange(name, value) {
    const newFilter = { ...filter, [name]: value }
    setFilter(newFilter)
  }

  function onChangeOrder(name: string) {
    const value = order[name]
    const newOrder = { ...order, [name]: value ? (value === 1 ? -1 : null) : 1 }
    if (newOrder[name] === 1) {
      newOrder.fieldOrder.push(name)
    } else if (newOrder[name] === null) {
      newOrder.fieldOrder.delete(name)
    }
    setOrder(newOrder)
  }

  function onDelete(id: string) {
    api.instance.delete(id).then(() => setFilter({ ...filter }))
  }

  return (
    <div style={{ maxWidth: '1360px', margin: 'auto', padding: '8px' }}>
      <Header>
        <ItemHeader label='Applications' value={aggregate?.applications} />
        <ItemHeader label='Instances' value={aggregate?.instances} />
        <ItemHeader label='Instances down' value={aggregate?.downs} />
      </Header>
      <Filter justifyContent='flex-start'>
        <Input type='text' onChange={e => onChange('name', e.target.value)} placeholder='Filter applications' />
        <Input type='text' onChange={e => onChange('version', e.target.value)} placeholder='Filter versions' />
        <div>
          <input
            id='up'
            type='checkbox'
            checked={filter.status === 'CONNECTED'}
            onChange={e => onChange('status', e.target.checked ? 'CONNECTED' : null)}
          />
          <Label padding='0px 5px' cursor='pointer' htmlFor='up'>
            Up
          </Label>
        </div>
        <div>
          <input
            id='down'
            type='checkbox'
            checked={filter.status === 'DOWN'}
            onChange={e => onChange('status', e.target.checked ? 'DOWN' : null)}
          />
          <Label padding='0px 5px' cursor='pointer' htmlFor='down'>
            Down
          </Label>
        </div>
      </Filter>
      <InstancesTable instances={data} onChangeOrder={onChangeOrder} order={order} onDelete={onDelete} />
    </div>
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
  padding: 20px 0px 0px;
  gap: 60px;

  @media ${queries.tabletAndDown} {
    padding: 10px 0px 0px;
    gap: 14px;
  }
`

const Filter = styled(FlexBox)<FlexBoxProps>`
  padding: 20px 0px;

  input[type='text'] {
    width: 400px;
    @media ${queries.tabletAndDown} {
      width: 340px;
    }
  }
`
