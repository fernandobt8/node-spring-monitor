import React from 'react'
import styled from 'styled-components'
import { Label } from '../components/Label'
import { queries } from '../theme/theme'
import { InstancesBody } from './InstancesBody'
import { InstanceDTO } from './InstancesListView'

export type InstancesTableProps = {
  instances: InstanceDTO[]
  onChangeOrder: (name: string) => void
  onDelete: (id: string) => void
  order: any
}

const upArrow = String.fromCodePoint(parseInt('02191', 16))
const downArrow = String.fromCodePoint(parseInt('02193', 16))
const arrow = (value: number) => (value ? (value === 1 ? upArrow : downArrow) : ' ')

export function InstancesTable({ instances, onChangeOrder, order, onDelete }: InstancesTableProps) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableColumn name='Status' onChangeOrder={onChangeOrder} arrow={arrow(order?.status)} />
          <TableColumn name='name' onChangeOrder={onChangeOrder}>
            <Label block cursor='pointer' style={{ width: '100%', textAlign: 'left' }}>
              Application {arrow(order?.name)}
            </Label>
          </TableColumn>
          <TableColumn name='Version' onChangeOrder={onChangeOrder} arrow={arrow(order?.version)} />
          <TableColumn name='Sessions' onChangeOrder={onChangeOrder} arrow={arrow(order?.sessions)} />
          <TableColumn name='Uptime' onChangeOrder={onChangeOrder} arrow={arrow(order?.uptime)} />
        </tr>
      </TableHeader>
      <tbody>
        {instances.map(item => (
          <InstancesBody key={item._id} props={item} onDelete={onDelete} />
        ))}
      </tbody>
    </Table>
  )
}

function TableColumn(props: { name; children?; onChangeOrder?; arrow? }) {
  const { name, children, onChangeOrder, arrow } = props

  return (
    <th onClick={onChangeOrder ? () => onChangeOrder(name.toLowerCase()) : null}>
      {children ? children : <Label cursor={onChangeOrder ? 'pointer' : 'inherit'}>{`${name} ${arrow ? arrow : ''}`}</Label>}
    </th>
  )
}

const TableHeader = styled.thead`
  box-shadow: 0 0 2px 2px var(--secondaryColor);
  margin: 0px 10px;
`

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0px 5px;
  width: 100%;

  th,
  td {
    padding: 5px;
    text-align: center;
  }

  td {
    border-top: 2px solid var(--primaryColor);
    border-bottom: 2px solid var(--primaryColor);
  }

  td:first-child {
    border-radius: 5px 0 0 5px;
    border-left: 2px solid var(--primaryColor);
  }
  td:last-child {
    border-radius: 0 5px 5px 0;
    border-right: 2px solid var(--primaryColor);
  }

  @media ${queries.tabletAndDown} {
    // prettier-ignore
    table, thead, tbody, && td, tr { 
      display: block; 
      border: none;
      border-right: none;
      border-left: none;
    }

    background-color: transparent;

    thead tr {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin: 0px;
    }

    tbody tr {
      position: relative;
      margin: 0px 5px;
      padding-top: 8px;
      padding: 10px 0px;
    }

    tr:not(:first-child) {
      border-top: 2px solid var(--secondaryColor);
    }

    td:nth-of-type(1) {
      position: absolute;
      top: 1rem;
      width: 10%;
    }
    td:nth-of-type(2) {
      position: relative;
      padding-left: 15%;
    }
    td:nth-of-type(3) {
      position: absolute;
      padding-left: 0px;
      width: 30%;
      white-space: nowrap;
    }
    td:nth-of-type(4) {
      position: absolute;
      padding-left: 30%;
      width: 30%;
    }
    td:nth-of-type(5) {
      position: absolute;
      padding-left: 60%;
      width: 30%;
    }
    td:nth-of-type(6) {
      position: relative;
      padding-left: 90%;
      margin-top: 5px;
    }

    td:nth-of-type(3):before {
      content: 'Version';
      display: block;
    }
    td:nth-of-type(4):before {
      content: 'Sessions';
      display: block;
    }
    td:nth-of-type(5):before {
      content: 'Uptime';
      display: block;
    }
  }
`
