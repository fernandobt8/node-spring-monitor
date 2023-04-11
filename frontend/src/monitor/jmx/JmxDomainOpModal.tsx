import React, { useState } from 'react'
import { useParams } from 'react-router'
import { LabelProps } from 'recharts'
import styled from 'styled-components'
import api from '../../api'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Label } from '../../components/Label'
import { isPrimitive } from '../../utils/objectUtils'
import useHeight from '../../hooks/useHeight'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomainOpRowDTO } from './JmxDomainOp'

export function JmxDomainOpModal({ value, mbean }: { value: JmxDomainOpRowDTO; mbean: string }) {
  const { id } = useParams<InstanceParams>()
  const [args, setArgs] = useState(new Array(value.args?.length))
  const [response, setResponse] = useState<any>()
  const [height, ref] = useHeight({ initialHeight: 0 })

  function execute() {
    api.jmx
      .post(id, {
        arguments: args,
        mbean: mbean,
        operation: value.operation,
        type: 'exec',
      })
      .then(({ data }) => {
        setResponse(data)
      })
  }

  function updateArg(args, index, value) {
    args[index] = value
    return args
  }

  return (
    <ModalContent>
      <div style={{ paddingBottom: '10px' }} ref={ref}>
        <LabelHeader block bold>
          {value.methodName}
        </LabelHeader>
        <ModalInputs>
          {value.args?.map((arg, index) => (
            <div key={index}>
              <div>
                <Label size='0.9rem'>{`${arg.name}: `}</Label>
                <Label size='0.7rem'>{arg.type}</Label>
              </div>
              <Input
                width='300px'
                name={arg.name}
                onChange={e => setArgs(oldArgs => updateArg([...oldArgs], index, e.target.value))}
              />
              {arg.name !== arg.desc && (
                <Label block size='0.8rem'>
                  {arg.desc}
                </Label>
              )}
            </div>
          ))}
        </ModalInputs>
        <Button onClick={() => execute()}>Execute</Button>
        {response?.status === 200 && (
          <Label size='0.9rem' padding='10px' backgroundColor='green' block margin='10px 0px 0px'>
            Execution successfully
          </Label>
        )}
        {response?.error && (
          <ModalError>
            <div>Execution Error</div>
            <div>{response.error}</div>
          </ModalError>
        )}
      </div>
      <ModalValue height={height}>
        {isPrimitive(value.ret)
          ? response?.value !== undefined && String(response.value)
          : JSON.stringify(response?.value, null, 2)}
      </ModalValue>
    </ModalContent>
  )
}
const ModalValue = styled.pre<{ height }>`
  overflow: auto;
  max-width: 80vw;
  max-height: calc(90vh - ${p => p.height}px);
  font-size: 0.7rem;
`

const ModalError = styled.div`
  margin-top: 10px;
  font-size: 0.9rem;
  background-color: red;
  padding: 10px;
`

const LabelHeader = styled(Label)<LabelProps>`
  border-bottom: 2px solid var(--secondaryColor);
  padding: 0 8px 5px;
  margin: 0px -8px 0px;
`

const ModalInputs = styled.div`
  padding-top: 10px;
  & > div {
    padding-bottom: 10px;
    > div {
      padding-bottom: 5px;
    }
  }
`

const ModalContent = styled.div`
  text-align: left;
`
