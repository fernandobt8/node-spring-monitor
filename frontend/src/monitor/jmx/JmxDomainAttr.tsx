import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { BreakLine } from '../../components/BreakLine'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { Label } from '../../components/Label'
import { colors } from '../../theme/colors'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomainProp, JmxDomainPropAttrDTO } from './Jmx'

const anyEnd = (value: string, ...endsWith: string[]) =>
  endsWith.reduce((prev, current) => value.endsWith(current) || prev, false)

export function JmxDomainAttr({ props }: { props: JmxDomainProp }) {
  const { id } = useParams<InstanceParams>()
  const [jmxProp, setJmxProp] = useState<JmxDomainProp>(props)

  useEffect(() => {
    api
      .redirectPost(id, `jolokia?`, {
        config: { ignoreErrors: true },
        mbean: `${props.domain}:${props.mbean}`,
        type: 'read',
      })
      .then(({ data }) => {
        setJmxProp(old => {
          const newJmxProp = { ...old }
          Object.keys(data?.value).forEach(key => {
            if (newJmxProp.attr[key]) {
              const attr = newJmxProp.attr[key]
              const value = data.value[key]
              attr.value = JSON.stringify(value, null, 2)
            }
          })
          return newJmxProp
        })
      })
  }, [id, props.domain, props.mbean, setJmxProp])

  const attrs = jmxProp?.attr
  return (
    <Lista>
      {Object.keys(attrs).map(key => (
        <JmxDomainAttrRow name={key} attr={attrs[key]} />
      ))}
    </Lista>
  )
}

export function JmxDomainAttrRow({ name, attr }: { name: string; attr: JmxDomainPropAttrDTO }) {
  const [valueHeight, setValueHeight] = useState(0)
  const valueRef = useRef(null)

  useEffect(() => setValueHeight(valueRef?.current?.getBoundingClientRect()?.height), [attr.value])

  return (
    <Row as='li' gap={0} wrap='wrap' key={name} justifyContent='flex-sart'>
      <Label bold padding='0 10px 0 0'>
        {name}
      </Label>

      {anyEnd(attr.type.toLowerCase(), 'int', 'long', 'boolean', 'string', 'double', 'float') ? (
        <LabelValue ref={valueRef} overHeight={valueHeight > 100}>
          {attr.value}
        </LabelValue>
      ) : (
        <>
          <Label size='14px'>{attr.type}</Label>
          <ValueObject ref={valueRef} overHeight={valueHeight > 100}>
            {attr.value}
          </ValueObject>
        </>
      )}
      <BreakLine />
      <Label size='12px'>{attr.desc}</Label>
    </Row>
  )
}

const Lista = styled.ul`
  padding: 10px;
`

const Row = styled(FlexBox)<FlexBoxProps>`
  padding: 5px;
`

const LabelValue = styled(Label)<{ overHeight: boolean }>`
  ${p => p.overHeight && `border: 2px solid ${colors.secondary};`}
  ${p => p.overHeight && 'height: 100px;'}
  ${p => p.overHeight && 'width: 100%;'}
  ${p => p.overHeight && 'resize: both'};
  overflow: auto;
  padding: 5px;
`
const ValueObject = styled.pre<{ overHeight: boolean }>`
  border: ${`2px solid ${colors.secondary}`};
  font-size: 12px;
  ${p => p.overHeight && 'height: 100px;'}
  width: 100%;
  overflow: auto;
  resize: both;
  padding: 5px;
`
