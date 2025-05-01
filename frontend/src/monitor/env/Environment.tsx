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
  const { endpoints } = useInstanceDto()

  const { path, url } = useRouteMatch()

  return (
    <div style={{ textAlign: 'left' }}>
      <ToggleOption gap={0}>
        {endpoints.env && <NavTabStyled to={`${url}/env`}>Env</NavTabStyled>}
        {endpoints.configprops && <NavTabStyled to={`${url}/props`}>Config</NavTabStyled>}
      </ToggleOption>

      <Switch>
        <Route exact path={`${path}`} render={() => <Redirect to={`${url}/${endpoints.env ? 'env' : 'props'}`} />} />
        <Route path={`${path}/env`}>
          <Env />
        </Route>
        <Route path={`${path}/props`}>
          <ConfigProps />
        </Route>
      </Switch>
    </div>
  )
}

function Env() {
  const { id } = useInstanceDto()
  const [env, setEnv] = useState<EnvironmentDTO>()

  useEffect(() => {
    api.env(id).then(({ data }) => setEnv(data))
  }, [id])

  return (
    <>
      <div> Active profiles: {env?.activeProfiles.join(', ')}</div>
      <PropertySource values={env?.propertySources} count={1} />
    </>
  )
}

function ConfigProps() {
  const { id, name } = useInstanceDto()

  const [configs, setConfigs] = useState<EnvironmentDTO>()

  useEffect(() => {
    api.configProps(id).then(({ data }) => {
      let beans = data?.contexts?.[name !== 'spring-boot-application' ? name : 'application']?.beans
      setConfigs({
        propertySources: Object.entries(beans).map(([key, value]: [string, any]) => {
          return { name: key, properties: flatten(value.properties, value.prefix) }
        }),
      })
    })
  }, [id, name])

  return <PropertySource values={configs?.propertySources} count={2} />
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
