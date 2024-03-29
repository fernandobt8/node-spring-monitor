import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import api from '../../api'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { flatten } from '../../utils/objectUtils'
import { useInstanceDto } from '../InstanceContext'
import { PropertySource } from './PropertySource'

export type PropertiesSources = {
  name: string
  properties: { [key: string]: string | { value: string } }
}

export type EnvironmentDTO = {
  activeProfiles?: string[]
  propertySources: PropertiesSources[]
}

export function Environment() {
  const { _id: id } = useInstanceDto()
  const [env, setEnv] = useState<EnvironmentDTO>()
  const [configs, setConfigs] = useState<EnvironmentDTO>()
  const { path, url } = useRouteMatch()

  useEffect(() => {
    api.env(id).then(({ data }) => setEnv(data))
  }, [id])

  useEffect(() => {
    api.configProps(id).then(({ data }) => {
      let beans = data?.contexts?.application?.beans
      setConfigs({
        propertySources: Object.entries(beans).map(([key, value]: [string, any]) => {
          return { name: key, properties: flatten(value.properties, value.prefix) }
        }),
      })
    })
  }, [id])

  let count = 0
  return (
    <div style={{ textAlign: 'left' }}>
      <ToggleOption gap={0}>
        <NavTabStyled to={`${url}/config`}>Env</NavTabStyled>
        <NavTabStyled to={`${url}/props`}>Config</NavTabStyled>
      </ToggleOption>

      <div> Active profiles: {env?.activeProfiles.join(', ')}</div>
      <Switch>
        <Route exact path={`${path}`} render={() => <Redirect to={`${url}/config`} />} />
        <Route path={`${path}/config`}>
          <PropertySource values={env?.propertySources} count={++count} />
        </Route>
        <Route path={`${path}/props`}>
          <PropertySource values={configs?.propertySources} count={++count} />
        </Route>
      </Switch>
    </div>
  )
}

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
