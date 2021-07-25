import React, { useCallback, useReducer, useState } from 'react'
import styled from 'styled-components'
import { FlexBox } from '../../components/FlexBox'

export function JmxDomain(props: { [key: string]: any }) {
  const [columnMaxWidth, setColumnMaxWidth] = useReducer((oldState: { [key: string]: number }, { key, value }) => {
    if (value && (!oldState[key] || value > oldState[key])) {
      return { ...oldState, ...{ [key]: value } }
    }
    return oldState
  }, {})

  const newLocal = Object.keys(props).map(row => row.split(',').map(v => v.split('=')))

  newLocal.sort((a, b) => (a.length > b.length ? 1 : -1))

  let counts: { [key: string]: number } = {}

  newLocal.forEach(row => {
    row.forEach(attr => {
      if (!counts[attr[0]]) counts[attr[0]] = 0
      counts[attr[0]]++
    })
  })

  newLocal.forEach(row =>
    row.sort((a, b) => {
      if (a[0] === 'type') {
        return -1
      } else {
        if (counts[a[0]] === counts[b[0]]) return a[1].length > b[1].length ? 1 : -1
        else return counts[a[0]] > counts[b[0]] ? -1 : 1
      }
    })
  )

  return (
    <Table style={{ textAlign: 'left' }}>
      {newLocal.map(row => (
        <tr>
          <FlexBox justifyContent='flex-start'>
            {row.map(attr => (
              <TableColumn attr={attr} setColumnMaxWidth={setColumnMaxWidth} width={columnMaxWidth[attr[0]]} />
            ))}
          </FlexBox>
        </tr>
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
    <td key={attr[0]} ref={div} style={{ width: `${width}px` }}>
      {attr.map(v => (
        <div>{v}</div>
      ))}
    </td>
  )
}

const Table = styled.table`
  font-size: 15px;
  width: 100%;
`
