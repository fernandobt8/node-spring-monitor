import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import styled from 'styled-components'
import { FlexBox, FlexBoxProps } from '../components/FlexBox'
import { Uptime } from '../components/Uptime'
import { BorderRadius } from '../theme/styles'
import { InstanceDTO } from './InstancesList'

type InstancesTableProps = {
  instances: InstanceDTO[]
}

export function InstancesTable({ instances }: InstancesTableProps) {
  return (
    <ul>
      {instances.map(item => (
        <ItemList key={item.id} {...item} />
      ))}
    </ul>
  )
}

function ItemList(props: InstanceDTO) {
  const history = useHistory()
  const { url } = useRouteMatch()

  function itemCliked() {
    history.push(`${url}/${props.id}`)
  }

  return (
    <ItemListStyle as='li' onClick={itemCliked} key={props.name} justifyContent={'space-around'}>
      <div>{props.status === 'CONNECTED' ? 'U' : 'D'}</div>
      <Name>
        <div>{props.name}</div>
        <div>{props.serviceUrl}</div>
      </Name>
      <div style={{ minWidth: 120 }}>{props.version ?? '0.0.0'}</div>
      <div>
        <div>Sessions</div>
        <div>{props.sessions ?? 0}</div>
      </div>
      <div style={{ minWidth: '110px' }}>
        <div>Uptime</div>
        <Uptime time={props.uptime} />
      </div>
    </ItemListStyle>
  )
}

const Name = styled.div`
  width: 350px;
  text-align: left;
`

const ItemListStyle = styled(FlexBox)<FlexBoxProps>`
  ${BorderRadius}

  max-width: 1360px;
  min-height: 50px;

  margin: auto;
  margin-bottom: 5px;

  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }
`
