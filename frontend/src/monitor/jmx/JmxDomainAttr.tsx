import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import useResizeObserver from 'use-resize-observer'
import api from '../../api'
import { BreakFlexLine } from '../../components/BreakFlexLine'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { Label } from '../../components/Label'
import { colors } from '../../theme/colors'
import { isPrimitive } from '../../utils/objectUtils'
import useHeight from '../../hooks/useHeight'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomainProp, JmxDomainPropAttrDTO } from './Jmx'

export function JmxDomainAttr({ jmxProp, updateHeight }: { jmxProp: JmxDomainProp; updateHeight: () => void }) {
  const { id } = useParams<InstanceParams>()
  const [jmxPropValue, setJmxPropValue] = useState<JmxDomainProp>(jmxProp)

  useEffect(() => {
    api.jmx
      .post(id, {
        mbean: `${jmxProp.domain}:${jmxProp.mbean}`,
        type: 'read',
        config: { ignoreErrors: true },
      })
      .then(({ data }) => {
        setJmxPropValue(old => {
          const newJmxProp = { ...old }
          Object.entries(data?.value).forEach(([key, value]) => {
            if (newJmxProp.attr[key]) {
              newJmxProp.attr[key].value = JSON.stringify(value, null, 2)
            }
          })
          return newJmxProp
        })
      })
  }, [id, jmxProp.domain, jmxProp.mbean, setJmxPropValue])

  const attrs = jmxPropValue?.attr
  return (
    <Lista>
      {Object.entries(attrs).map(([key, value]) => (
        <JmxDomainAttrRow key={key} name={key} attr={value} updateHeight={updateHeight} />
      ))}
    </Lista>
  )
}

export function JmxDomainAttrRow(props: { name: string; attr: JmxDomainPropAttrDTO; updateHeight: () => void }) {
  const { name, attr, updateHeight } = props
  const valueRef = useRef(null)
  useResizeObserver({ ref: valueRef, onResize: () => updateHeight() })
  const [valueHeight] = useHeight({ initialRef: valueRef, initialHeight: 0, deps: [attr.value] })

  return (
    <Row as='li' gap={0} wrap='wrap' key={name} justifyContent='flex-sart'>
      <Label bold padding='5px 10px 5px 0'>
        {name}
      </Label>

      {isPrimitive(attr.type) ? (
        <LabelValue ref={valueRef} overHeight={valueHeight > 100}>
          {attr.value}
        </LabelValue>
      ) : (
        <>
          <Label size='0.8rem'>{attr.type}</Label>
          <ValueObject ref={valueRef} overHeight={valueHeight > 100}>
            {attr.value}
          </ValueObject>
        </>
      )}
      <BreakFlexLine />
      {name !== attr.desc && <Label size='0.7rem'>{attr.desc}</Label>}
    </Row>
  )
}

const Lista = styled.ul`
  padding: 10px;
`

const Row = styled(FlexBox)<FlexBoxProps>`
  padding: 5px;
`

const LabelValue = styled(Label)<{ overHeight: boolean; size?: string }>`
  ${p => p.overHeight && `border: 2px solid ${colors.secondary};`}
  ${p => p.overHeight && 'height: 100px;'}
  ${p => p.overHeight && 'width: 100%;'}
  ${p => p.overHeight && 'resize: both'};
  overflow: auto;
  padding: 5px;
`
const ValueObject = styled.pre<{ overHeight: boolean }>`
  border: ${`2px solid ${colors.secondary}`};
  font-size: 0.7rem;
  ${p => p.overHeight && 'height: 100px;'}
  width: 100%;
  overflow: auto;
  resize: both;
  padding: 5px;
`
