import React from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import { FlexBox, FlexBoxProps } from '../components/FlexBox'
import { Uptime } from '../components/Uptime'
import { Environment } from './env/Environment'
import { Geral } from './geral/Geral'
import { useInstanceDto } from './InstanceContext'
import { Jmx } from './jmx/Jmx'
import { Logging } from './log/Logging'
import { Metrics } from './metrics/Metrics'
import { Thread } from './thread/Thread'

export type InstanceParams = {
  id: string
}

export default function InstanceMenu() {
  const { path, url } = useRouteMatch()
  const instance = useInstanceDto()

  return (
    <>
      <Header gap={60}>
        <div>{instance?.name}</div>
        <div>{instance?.version}</div>
        <div>
          <div>Sessions</div>
          {instance?.sessions}
        </div>
        <div>
          <div>Uptime</div>
          <Uptime time={instance?.uptime} />
        </div>
      </Header>
      <div>
        <InstanceMenuTabs gap={0}>
          <NavTabStyled to={`${url}/geral`}>Geral</NavTabStyled>
          <NavTabStyled to={`${url}/thread`}>Threads</NavTabStyled>
          <NavTabStyled to={`${url}/log`}>Log</NavTabStyled>
          <NavTabStyled to={`${url}/metrics`}>Metrics</NavTabStyled>
          <NavTabStyled to={`${url}/jmx`}>Jmx</NavTabStyled>
          <NavTabStyled to={`${url}/env`}>Env</NavTabStyled>
        </InstanceMenuTabs>
        <Container>
          <Switch>
            <Redirect exact from={`${path}`} to={`${url}/geral`} />
            <Route path={`${path}/geral`} component={Geral} />
            <Route path={`${path}/thread`} component={Thread} />
            <Route path={`${path}/log`} component={Logging} />
            <Route path={`${path}/metrics`} component={Metrics} />
            <Route path={`${path}/jmx`} component={Jmx} />
            <Route path={`${path}/env`} component={Environment} />
          </Switch>
        </Container>
      </div>
    </>
  )
}

const Container = styled.div`
  padding: 20px;
`

const Header = styled(FlexBox)<FlexBoxProps>`
  padding: 15px 0px;
  font-size: 1.4rem;
`

const NavTabStyled = styled(NavTab)`
  color: var(--primaryColor);
  text-decoration: none;
  font-size: 1.4rem;
  position: relative;
  bottom: -2px;
  padding: 6px 12px;
  background-color: transparent;

  &.active {
    border: 2px solid var(--primaryColor);
    border-radius: 5px 5px 0 0;
    border-bottom: none;
    background: var(--backgroundColor);
  }
`

const InstanceMenuTabs = styled(FlexBox)`
  border-bottom: 2px solid var(--primaryColor);
  margin: 0px 10px;
`
