import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import styled from 'styled-components'
import { Uptime } from '../components/Uptime'
import { InstanceDTO } from './InstancesList'

type InstancesTableProps = {
  instances: InstanceDTO[]
}

export function InstancesTable({ instances }: InstancesTableProps) {
  return (
    <MainList>
      {instances.map(item => (
        <ItemList {...item} />
      ))}
    </MainList>
  )
}

function ItemList(props: InstanceDTO) {
  const history = useHistory()
  const { path } = useRouteMatch()

  function itemCliked() {
    history.push(`${path}/${props.id}`)
  }

  return (
    <ItemListCss onClick={itemCliked} key={props.name}>
      <Status>{props.status}</Status>
      <Name>
        <div>{props.name}</div>
        <div>{props.serviceUrl}</div>
      </Name>
      <TextCenter style={{ minWidth: 120 }}>{props.version || '0.0.0'}</TextCenter>
      <TextCenter>
        <div>Sessions</div>
        <div>{props.sessions || 0}</div>
      </TextCenter>
      <TextCenter>
        <div>Uptime</div>
        <Uptime time={props.uptime} />
      </TextCenter>
    </ItemListCss>
  )
}

const Status = styled.div`
  margin: auto 5px;
  min-width: 100px;
`

const TextCenter = styled.div`
  margin: auto;
  text-align: center;
`

const Name = styled.div`
  margin: auto 0px;
  width: 350px;
  > div {
    text-align: left;
  }
`

const MainList = styled.ul`
  text-align: center;
  margin: 0px;
  padding: 5px 25px;
`

const ItemListCss = styled.li`
  border: 2px solid ${props => props.theme.primaryColor};
  border-radius: 5px;

  max-width: 1360px;
  min-height: 50px;

  margin: auto;
  margin-bottom: 5px;

  display: flex;
  flex-direction: row;
  gap: 20px;
  text-align: left;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.secondaryColor};
  }

  &::marker {
    content: '';
  }
`

export default InstancesTable
