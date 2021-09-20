import React, { useCallback, useMemo, useReducer } from 'react'
import styled from 'styled-components'
import { JmxDomainDTO } from './Jmx'
import { JmxDomainRow } from './JmxDomainRow'

export function JmxDomain(props: JmxDomainDTO) {
  const [columnMaxWidth, setColumnMaxWidth] = useReducer((oldState: { [key: string]: number }, { key, value }) => {
    if (value && (!oldState[key] || value > oldState[key])) {
      return { ...oldState, ...{ [key]: value } }
    }
    return oldState
  }, {})

  const rows = useMemo(() => Object.values(props).sort((a, b) => (a.props.length > b.props.length ? 1 : -1)), [props])

  return (
    <Table style={{ textAlign: 'left' }}>
      {rows.map(row => (
        <JmxDomainRow key={row.namePath} jmxProp={row}>
          {row.props.map(attr => (
            <TableColumn key={attr[0]} attr={attr} setColumnMaxWidth={setColumnMaxWidth} width={columnMaxWidth[attr[0]]} />
          ))}
        </JmxDomainRow>
      ))}
    </Table>
  )
}

function TableColumn({ attr, setColumnMaxWidth, width }) {
  const key = attr[0]

  const div = useCallback(
    node => setColumnMaxWidth({ key, value: node?.getBoundingClientRect()?.width }),
    [key, setColumnMaxWidth]
  )

  return (
    <div ref={div} style={{ width: `${width}px` }}>
      {attr.map(v => (
        <div key={v}>{v}</div>
      ))}
    </div>
  )
}

const Table = styled.ol`
  flex: 1 1 auto;
  min-width: 0px;
`
