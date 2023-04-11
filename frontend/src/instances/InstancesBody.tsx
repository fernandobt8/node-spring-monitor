import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import styled from 'styled-components'
import { Uptime } from '../components/Uptime'
import { InstanceDTO } from './InstancesListView'

export function InstancesBody({ props, onDelete }: { props: InstanceDTO; onDelete }) {
  const history = useHistory()
  const { url } = useRouteMatch()

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
    <ItemListStyle onClick={() => history.push(`${url}/${props._id}`)} key={props.name}>
      <td style={{ color: status ? 'green' : 'red' }}>{status ? 'U' : 'D'}</td>
      <td style={{ textAlign: 'left' }}>
        <div>{props.name}</div>
        <Link onClick={linkCliked}>{props.serviceUrl}</Link>
      </td>
      <td>{props.version ?? '-'}</td>
      <td>{props.sessions ?? '-'}</td>
      <td>
        <Uptime time={props.uptime} />
      </td>
      <td>
        <svg width='18' height='18' fill='currentColor' viewBox='0 0 16 16' onClick={innerDelete}>
          <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z' />
          <path
            fill-rule='evenodd'
            d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'
          />
        </svg>
      </td>
    </ItemListStyle>
  )
}

const ItemListStyle = styled.tr`
  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }
`

const Link = styled.a`
  color: var(--blueColor);
  text-decoration: underline;
`
