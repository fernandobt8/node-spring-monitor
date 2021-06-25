import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import api from '../api'
import { Uptime } from '../components/Uptime'
import { InstanceDTO } from '../instances/InstancesList'
import { Environment } from './env/Environment'
import { Geral } from './geral/Geral'
import { Logging } from './log/Logging'

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
      <Header>
        <HeaderItem>{instance?.name}</HeaderItem>
        <HeaderItem>{instance?.version}</HeaderItem>
        <HeaderItem>
          <div>Sessions</div>
          {instance?.sessions}
        </HeaderItem>
        <HeaderItem>
          <div>Uptime</div>
          <Uptime time={instance?.uptime} />
        </HeaderItem>
      </Header>
      <div>
        <InstanceMenuTabs>
          <NavTab to={`${url}/geral`}>Geral</NavTab>
          <NavTab to={`${url}/env`}>Env</NavTab>
          <NavTab to={`${url}/log`}>Log</NavTab>
        </InstanceMenuTabs>
        <Switch>
          <Route exact path={`${path}`} render={() => <Redirect to={`${url}/geral`} />} />
          <Route path={`${path}/geral`} component={Geral} exact />
          <Route path={`${path}/env`} component={Environment} />
          <Route path={`${path}/log`} component={Logging} />
        </Switch>
      </div>
    </>
  )
}

const HeaderItem = styled.div`
  margin: auto 0px;
  text-align: center;
`

const Header = styled.div`
  padding: 30px 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 60px;
  font-size: 20px;
`

const InstanceMenuTabs = styled.div`
  border-bottom: 2px solid ${props => props.theme.primaryColor};
  margin: 0px 10px;
  padding: 0px;
  text-align: center;

  > a {
    color: ${props => props.theme.primaryColor} !important;
    text-decoration: none !important;
    font-size: 20px !important;
  }

  .nav-tab {
    background-color: transparent;
    display: inline-block;
    border: 2px solid transparent;
    border-bottom: none;
    bottom: -2px;
    position: relative;
    list-style: none;
    padding: 6px 12px;
    cursor: pointer;

    &.active {
      background: ${props => props.theme.backgroundColor};
      border-color: ${props => props.theme.primaryColor};
      border-radius: 5px 5px 0 0;
    }
  }
`
