import React from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { NavTab, NavTabProps } from 'react-router-tabs'
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

  const endpoints = instance.endpoints || {}
  return (
    <>
      <Header gap={60}>
        <div>{instance?.name}</div>
        <div>{instance?.environment}</div>
        <div>
          <div>Uptime</div>
          <Uptime time={instance?.uptime} />
        </div>
        <div>
          <div>Instance Id</div>
          {instance?.metadata?.instanceId}
        </div>
      </Header>
      <div>
        <InstanceMenuTabs gap={0}>
          <NavTabStyled to={`${url}/geral`}>Geral</NavTabStyled>
          <Tab to={`${url}/thread`} enabled={endpoints.threaddump}>
            Threads
          </Tab>
          <Tab to={`${url}/log`} enabled={endpoints.loggers || endpoints.logfile}>
            Log
          </Tab>
          <Tab to={`${url}/metrics`} enabled={endpoints.metrics}>
            Metrics
          </Tab>
          <Tab to={`${url}/jmx`} enabled={endpoints.jolokia}>
            Jmx
          </Tab>
          <Tab to={`${url}/env`} enabled={endpoints.configprops || endpoints.env}>
            Env
          </Tab>
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

function Tab({ enabled, children, ...props }: NavTabProps & { enabled?: boolean }) {
  return enabled ? <NavTabStyled {...props}>{children}</NavTabStyled> : null
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
