import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import useResizeObserver from 'use-resize-observer'
import api from '../../api'
import { BreakLine } from '../../components/BreakLine'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { Label } from '../../components/Label'
import { colors } from '../../theme/colors'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomainProp, JmxDomainPropAttrDTO } from './Jmx'

const anyEnd = (value: string, ...endsWith: string[]) =>
  endsWith.reduce((prev, current) => value.endsWith(current) || prev, false)

export function JmxDomainAttr({ props, updateHeight }: { props: JmxDomainProp; updateHeight: () => void }) {
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
        <JmxDomainAttrRow key={key} name={key} attr={attrs[key]} updateHeight={updateHeight} />
      ))}
    </Lista>
  )
}

export function JmxDomainAttrRow(props: { name: string; attr: JmxDomainPropAttrDTO; updateHeight: () => void }) {
  const { name, attr, updateHeight } = props
  const [valueHeight, setValueHeight] = useState(0)
  const valueRef = useRef(null)
  useResizeObserver({ ref: valueRef, onResize: () => updateHeight() })

  useEffect(() => {
    setValueHeight(valueRef?.current?.getBoundingClientRect()?.height)
    updateHeight()
  }, [attr.value, updateHeight])

  return (
    <Row as='li' gap={0} wrap='wrap' key={name} justifyContent='flex-sart'>
      <Label size='15px' bold padding='5px 10px 5px 0'>
        {name}
      </Label>

      {anyEnd(attr.type.toLowerCase(), 'int', 'long', 'boolean', 'string', 'double', 'float') ? (
        <LabelValue size='15px' ref={valueRef} overHeight={valueHeight > 100}>
          {attr.value}
        </LabelValue>
      ) : (
        <>
          <Label size='12px'>{attr.type}</Label>
          <ValueObject ref={valueRef} overHeight={valueHeight > 100}>
            {attr.value}
          </ValueObject>
        </>
      )}
      <BreakLine />
      <Label size='10px'>{attr.desc}</Label>
    </Row>
  )
}

const Lista = styled.ul`
  padding: 10px;
`

const Row = styled(FlexBox)<FlexBoxProps>`
  padding: 5px;
`

const LabelValue = styled(Label)<{ overHeight: boolean; size: string }>`
  ${p => p.overHeight && `border: 2px solid ${colors.secondary};`}
  ${p => p.overHeight && 'height: 100px;'}
  ${p => p.overHeight && 'width: 100%;'}
  ${p => p.overHeight && 'resize: both'};
  overflow: auto;
  padding: 5px;
`
const ValueObject = styled.pre<{ overHeight: boolean }>`
  border: ${`2px solid ${colors.secondary}`};
  font-size: 11px;
  ${p => p.overHeight && 'height: 100px;'}
  width: 100%;
  overflow: auto;
  resize: both;
  padding: 5px;
`
