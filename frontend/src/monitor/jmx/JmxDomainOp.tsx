import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Label } from '../../components/Label'
import { JmxDomainProp, JmxDomainPropOpDTO } from './Jmx'

const opDTO = (k: string, jmxOp: JmxDomainPropOpDTO) => ({
  name: `${k}(${jmxOp.args.map(arg => arg.type).join(', ')}): ${jmxOp.ret}`,
  args: jmxOp.args,
  desc: jmxOp.desc,
})

export function JmxDomainOp({ jmxProp }: { jmxProp: JmxDomainProp }) {
  const values = useMemo(
    () =>
      Object.entries(jmxProp.op)
        .map(([k, v]) => (Array.isArray(v) ? v.map(opArray => opDTO(k, opArray)) : opDTO(k, v)))
        .flat(),
    [jmxProp.op]
  )

  return (
    <List>
      {values?.map(value => (
        <>
          <Row key={value.name}>
            <Item>
              <Label size='14px'>{value.name}</Label>
            </Item>
            <Label size='10px'>{value.desc}</Label>
          </Row>
        </>
      ))}
    </List>
  )
}

const List = styled.ul`
  padding: 10px;
  width: auto;
`

const Row = styled.li`
  padding: 10px 0px;
`
const Item = styled.div`
  padding: 5px 10px;
  box-shadow: 0 0 2px 2px var(--secondaryColor);

  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }
`
