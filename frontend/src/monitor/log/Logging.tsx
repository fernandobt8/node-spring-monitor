import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { Input } from '../../components/Input'
import { Label } from '../../components/Label'
import useHeight from '../../hooks/useHeight'
import { InstanceParams } from '../InstanceMenu'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { NavTab } from 'react-router-tabs'
import { Loggers } from './Loggers'
import { useInstanceDto } from '../InstanceContext'

const MB = 1024 * 1024

export function Logging() {
  const { path, url } = useRouteMatch()
  const { endpoints } = useInstanceDto()

  return (
    <div style={{ textAlign: 'left' }}>
      <ToggleOption gap={0}>
        {endpoints?.loggers && <NavTabStyled to={`${url}/loggers`}>Loggers</NavTabStyled>}
        {endpoints.logfile && <NavTabStyled to={`${url}/log-trace`}>Log file</NavTabStyled>}
      </ToggleOption>

      <Switch>
        <Route exact path={`${path}`} render={() => <Redirect to={`${url}/loggers`} />} />
        <Route path={`${path}/loggers`}>
          <Loggers />
        </Route>
        <Route path={`${path}/log-trace`}>
          <LogTrace />
        </Route>
      </Switch>
    </div>
  )
}

function LogTrace() {
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
const ToggleOption = styled(FlexBox)<FlexBoxProps>`
  border: 2px solid var(--primaryColor);
  width: fit-content;
  margin: auto;
`
const NavTabStyled = styled(NavTab)`
  color: var(--primaryColor);
  text-decoration: none;
  padding: 10px;

  &.active {
    background-color: var(--secondaryColor);
  }
`
