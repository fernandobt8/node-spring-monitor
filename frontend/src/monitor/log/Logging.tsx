import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { FlexBox } from '../../components/FlexBox'
import { Input } from '../../components/Input'
import useHeight from '../../utils/useHeight'
import { InstanceParams } from '../InstanceMenu'

export function Logging() {
  const { id } = useParams<InstanceParams>()
  const [log, setLog] = useState<string>()
  const [height, ref] = useHeight({ initialHeight: 0, deps: [] })
  const [minByte, setMinByte] = useState<number>(0)
  const [maxByte, setMaxByte] = useState<number>(1024)

  useEffect(() => {
    api.logFile(id, { Range: `bytes=${minByte * 1024}-${maxByte * 1024}` }).then(response => {
      setLog(response?.data?.body)
    })
  }, [id, maxByte, minByte])

  return (
    <>
      <div ref={ref}>
        <FlexBox>
          <Input type='number' value={minByte} onChange={e => setMinByte(Number(e.target.value))} />
          <Input type='number' value={maxByte} onChange={e => setMaxByte(Number(e.target.value))} />
        </FlexBox>
      </div>
      <Log height={(height as number) + 190}>{log}</Log>
    </>
  )
}

const Log = styled.pre<{ height }>`
  text-align: left;
  font-size: 12px;
  overflow: auto;
  height: calc(100vh - ${p => p.height}px);
`
