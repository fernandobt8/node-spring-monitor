import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import api from '../api'
import { FlexBox, FlexBoxProps } from '../components/FlexBox'
import { Uptime } from '../components/Uptime'
import { InstanceDTO } from '../instances/InstancesList'
import { Environment } from './env/Environment'
import { Geral } from './geral/Geral'
import { Logging } from './log/Logging'
import { Thread } from './thread/Thread'

export type InstaceParams = {
  id: string
}

export default function InstanceMenu() {
  const { id } = useParams<InstaceParams>()
  const { path, url } = useRouteMatch()
  const [instance, setInstance] = useState<InstanceDTO>()

  useEffect(() => {
    api.get(`/instances/${id}`).then(({ data }) => setInstance(data))
  }, [id])

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
          <NavTabStyled to={`${url}/env`}>Env</NavTabStyled>
        </InstanceMenuTabs>
        <Switch>
          <Route exact path={`${path}`} render={() => <Redirect to={`${url}/geral`} />} />
          <Route path={`${path}/geral`} component={Geral} />
          <Route path={`${path}/thread`} component={Thread} />
          <Route path={`${path}/log`} component={Logging} />
          <Route path={`${path}/env`} component={Environment} />
        </Switch>
      </div>
    </>
  )
}

const Header = styled(FlexBox)<FlexBoxProps>`
  padding: 30px 0px;
  font-size: 20px;
`

const NavTabStyled = styled(NavTab)`
  color: var(--primaryColor);
  text-decoration: none;
  font-size: 20px;
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
