import React, { useEffect, useState } from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import api from '../../api'
import { FlexBox } from '../../components/FlexBox'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomain } from './JmxDomain'

type JmxDTO = {
  [key: string]: any
}

export function Jmx() {
  const { id } = useParams<InstanceParams>()
  const { path, url } = useRouteMatch()
  const [jmx, setJmx] = useState<JmxDTO>()

  useEffect(() => {
    api.redirectGet(id, 'jolokia/list', { Accept: 'application/json' }).then(({ data }) => {
      console.log(data.value)
      setJmx(data.value)
    })
  }, [id, setJmx])

  return (
    <FlexBox justifyContent='flex-start' alignItems='flex-start' wrap='nowrap'>
      <ul>
        {jmx &&
          Object.keys(jmx).map(key => (
            <SideBar key={key} to={`${url}/${key}`}>
              {key}
            </SideBar>
          ))}
      </ul>

      <Switch>
        {jmx &&
          Object.keys(jmx).map(key => (
            <Route key={key} path={`${path}/${key}`}>
              <JmxDomain {...jmx[key]} />
            </Route>
          ))}
      </Switch>
    </FlexBox>
  )
}

const SideBar = styled(NavTab)`
  padding: 7px 5px;
  display: block;
  text-decoration: none;
  color: var(--primaryColor);
  //   border-bottom: 2px solid var(--secondaryColor);

  //   background-color: var(--secondaryColor);
  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }

  &.active {
    background: var(--backgroundColor);
    background-color: var(--secondaryColor);
  }

  &::marker {
    content: '';
  }
`
