import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { FlexBox } from '../../components/FlexBox'
import { Input } from '../../components/Input'
import { Label } from '../../components/Label'
import useHeight from '../../hooks/useHeight'
import { InstanceParams } from '../InstanceMenu'

const MB = 1024 * 1024

export function Logging() {
  const { id } = useParams<InstanceParams>()
  const [log, setLog] = useState<string>()
  const [totalRange, setTotalRange] = useState<string>('nope')
  const [height, ref] = useHeight({ initialHeight: 0, deps: [] })
  const [minByte, setMinByte] = useState<number>(0)
  const [maxByte, setMaxByte] = useState<number>(1)

  useEffect(() => {
    api.logFile(id, { Range: `bytes=${Math.ceil(minByte * MB)}-${Math.ceil(maxByte * MB)}` }).then(({ data }) => {
      setLog(data?.body)
      const range = data?.headers?.['content-range']
      const nRange = Number(range?.substring(range?.lastIndexOf('/') + 1))
      if (!isNaN(nRange)) {
        setTotalRange((nRange / MB).toFixed(2))
      }
    })
  }, [id, maxByte, minByte])

  return (
    <>
      <div ref={ref} style={{ paddingBottom: '10px' }}>
        <FlexBox gap={10} justifyContent='flex-start'>
          <Label>Min. MB</Label>
          <Input type='number' value={minByte} onChange={e => setMinByte(Number(e.target.value))} />
          <Label>Max. MB</Label>
          <Input type='number' value={maxByte} onChange={e => setMaxByte(Number(e.target.value))} />
          <Label>{`Total ${totalRange}MB`}</Label>
        </FlexBox>
      </div>
      <Log height={(height as number) + 190}>{log}</Log>
    </>
  )
}

const Log = styled.pre<{ height }>`
  text-align: left;
  font-size: 0.7rem;
  overflow: auto;
  height: calc(100vh - ${p => p.height}px);
`
