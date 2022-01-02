import React, { useCallback, useReducer } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import styled from 'styled-components'
import { FlexBox, FlexBoxProps } from '../components/FlexBox'
import { Label } from '../components/Label'
import { Uptime } from '../components/Uptime'
import { BorderRadius } from '../theme/styles'
import { InstanceDTO } from './InstancesList'

type InstancesTableProps = {
  instances: InstanceDTO[]
  onChangeOrder: (name: string) => void
  onDelete: (id: string) => void
  order: any
}

const upArrow = String.fromCodePoint(parseInt('02191', 16))
const downArrow = String.fromCodePoint(parseInt('02193', 16))
const arrow = (value: number) => (value ? (value === 1 ? upArrow : downArrow) : ' ')

export function InstancesTable({ instances, onChangeOrder, order, onDelete }: InstancesTableProps) {
  const maxWidths = useReducer((oldState: { [key: string]: number }, { name, value }) => {
    if (value && (!oldState[name] || value > oldState[name])) {
      return { ...oldState, [name]: value }
    }
    return oldState
  }, {})

  return (
    <>
      <TableHeader justifyContent={'space-evenly'}>
        <TableColumn name='Status' maxWidths={maxWidths} onChangeOrder={onChangeOrder} arrow={arrow(order?.status)} />
        <TableColumn name='name' maxWidths={maxWidths} onChangeOrder={onChangeOrder}>
          <Label block cursor='pointer' style={{ width: '100%', textAlign: 'left' }}>
            Application {arrow(order?.name)}
          </Label>
        </TableColumn>
        <TableColumn name='Version' maxWidths={maxWidths} onChangeOrder={onChangeOrder} arrow={arrow(order?.version)} />
        <TableColumn name='Sessions' maxWidths={maxWidths} onChangeOrder={onChangeOrder} arrow={arrow(order?.sessions)} />
        <TableColumn name='Uptime' maxWidths={maxWidths} onChangeOrder={onChangeOrder} arrow={arrow(order?.uptime)} />
        <div style={{ minWidth: 18 }} />
      </TableHeader>
      <ul>
        {instances.map(item => (
          <ItemList key={item._id} props={item} maxWidths={maxWidths} onDelete={onDelete} />
        ))}
      </ul>
    </>
  )
}

function ItemList({ props, maxWidths, onDelete }: { props: InstanceDTO; maxWidths: [any, any]; onDelete }) {
  const history = useHistory()
  const { url } = useRouteMatch()

  function itemCliked() {
    history.push(`${url}/${props._id}`)
  }

  function linkCliked(e) {
    e.stopPropagation()
    window.open(props.serviceUrl, '_blank')
  }

  function innerDelete(e) {
    e.stopPropagation()
    onDelete(props._id)
  }

  const status = props.status === 'CONNECTED'
  return (
    <ItemListStyle as='li' onClick={itemCliked} key={props.name} justifyContent={'space-evenly'}>
      <TableColumn name='Status' maxWidths={maxWidths}>
        <div style={{ color: status ? 'green' : 'red' }}>{status ? 'U' : 'D'}</div>
      </TableColumn>
      <TableColumn name='name' maxWidths={maxWidths}>
        <Name>
          <div>{props.name}</div>
          <Link onClick={linkCliked}>{props.serviceUrl}</Link>
        </Name>
      </TableColumn>
      <TableColumn name='Version' maxWidths={maxWidths}>
        <div>{props.version ?? '-'}</div>
      </TableColumn>
      <TableColumn name='Sessions' maxWidths={maxWidths}>
        <div>{props.sessions ?? '-'}</div>
      </TableColumn>
      <TableColumn name='Uptime' maxWidths={maxWidths}>
        <Uptime time={props.uptime} />
      </TableColumn>
      <svg width='18' height='18' fill='currentColor' viewBox='0 0 16 16' onClick={innerDelete}>
        <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
        <path
          fill-rule='evenodd'
          d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
        />
      </svg>
    </ItemListStyle>
  )
}

function TableColumn(props: { name; children?; maxWidths: [any, any]; onChangeOrder?; arrow? }) {
  const {
    name,
    children,
    maxWidths: [maxWidths, setMaxWidths],
    onChangeOrder,
    arrow,
  } = props
  const div = useCallback(node => setMaxWidths({ name, value: node?.getBoundingClientRect()?.width }), [name, setMaxWidths])

  return (
    <div ref={div} style={{ minWidth: maxWidths[name] }} onClick={onChangeOrder ? () => onChangeOrder(name.toLowerCase()) : null}>
      {children ? children : <Label cursor={onChangeOrder ? 'pointer' : 'inherit'}>{`${name} ${arrow ? arrow : ''}`}</Label>}
    </div>
  )
}

const TableHeader = styled(FlexBox)<FlexBoxProps>`
  padding: 10px 0px;
  max-width: 1360px;
  box-shadow: 0 0 2px 2px var(--secondaryColor);
  margin: 0px 5px 10px;
`

const Name = styled.div`
  width: 350px;
  text-align: left;
`

const Link = styled.a`
  color: var(--blueColor);
  text-decoration: underline;
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
