import React, { useMemo, useState } from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { Label } from '../../components/Label'
import { colors } from '../../theme/colors'
import { JmxDomainProp, JmxDomainPropOpDTO } from './Jmx'
import { JmxDomainOpModal } from './JmxDomainOpModal'

const opDTO = (k: string, jmxOp: JmxDomainPropOpDTO) => ({
  methodName: `${k}(${jmxOp.args.map(arg => arg.type).join(', ')}): ${jmxOp.ret}`,
  operation: `${k}(${jmxOp.args.map(arg => arg.type).join(',')})`,
  name: k,
  ret: jmxOp.ret,
  args: jmxOp.args,
  desc: jmxOp.desc,
})

type JmxDomainOpArg = {
  type: string
  name: string
  desc: string
}

export type JmxDomainOpRowDTO = {
  methodName: string
  operation: string
  name: string
  ret: string
  args?: JmxDomainOpArg[]
  desc: string
}

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
        <JmxDomainOpRow key={value.methodName} value={value} mbean={`${jmxProp.domain}:${jmxProp.mbean}`} />
      ))}
    </List>
  )
}

const customStyles = {
  overlay: {
    backgroundColor: colors.secondaryRgba,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: colors.background,
    color: colors.primary,
  },
}

export function JmxDomainOpRow({ value, mbean }: { value: JmxDomainOpRowDTO; mbean: string }) {
  const [open, setOpen] = useState(false)
  return (
    <Row>
      <Item onClick={() => setOpen(true)}>
        <Label size='0.9rem'>{value.methodName}</Label>
      </Item>
      {value.name !== value.desc && <Label size='0.7rem'>{value.desc}</Label>}
      <Modal isOpen={open} style={customStyles} onRequestClose={() => setOpen(false)}>
        <JmxDomainOpModal value={value} mbean={mbean} />
      </Modal>
    </Row>
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
