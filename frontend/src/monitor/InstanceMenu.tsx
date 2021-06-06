import React, { useEffect, useState } from 'react'
import { Route, useParams, useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import styled, { createGlobalStyle } from 'styled-components'
import api from '../api'
import { Uptime } from '../components/Uptime'
import { InstanceDTO } from '../instances/InstancesList'
import { Environment } from './env/Environment'
import { Geral } from './geral/Geral'

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
      <InstanceMenuStyle />
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
      <Tabs>
        <TabList>
          <Tab>
            <Link to={`${url}`}>Geral</Link>
          </Tab>
          <Tab>
            <Link to={`${url}/env`}>Env</Link>
          </Tab>
        </TabList>

        <TabPanel>
          <Route path={`${path}`} component={Geral} exact />
        </TabPanel>
        <TabPanel>
          <Route path={`${path}/env`} component={Environment} />
        </TabPanel>
      </Tabs>
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

const InstanceMenuStyle = createGlobalStyle`
  .react-tabs__tab-list {
    border-bottom: 2px solid ${props => props.theme.primaryColor};
    margin: 0px 10px;
    padding: 0px; 
    text-align: center;
  }
  
  .react-tabs__tab {
    background-color: transparent;
    display: inline-block;
    border: 2px solid transparent;
    border-bottom: none;
    bottom: -2px;
    position: relative;
    list-style: none;
    padding: 6px 12px;
    cursor: pointer;
    
    > a {
      color: ${props => props.theme.primaryColor};
      text-decoration: none;
      font-size: 20px;
    }
    
    &--selected {
      background: ${props => props.theme.backgroundColor};
      border-color: ${props => props.theme.primaryColor};
      border-radius: 5px 5px 0 0;
    }
  }
`
