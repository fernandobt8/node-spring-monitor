import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router'
import ReactTooltip from 'react-tooltip'
import styled, { createGlobalStyle, ThemeContext } from 'styled-components'
import api from '../../api'
import { NavTab } from 'react-router-tabs'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { flatten } from '../../utils/objectUtils'
import { InstaceParams } from '../InstanceMenu'
import { BorderRadius } from '../../theme/styles'

type PropertiesSources = {
  name: string
  properties: { [key: string]: string | { value: string } }
  count?: number
}

type EnvironmentDTO = {
  activeProfiles?: string[]
  propertySources: PropertiesSources[]
}

export function Environment() {
  const { id } = useParams<InstaceParams>()
  const [env, setEnv] = useState<EnvironmentDTO>()
  const [configs, setConfigs] = useState<EnvironmentDTO>()
  const { path, url } = useRouteMatch()

  useEffect(() => {
    api.redirectGet(id, 'env').then(({ data }) => setEnv(data))
  }, [id])

  useEffect(() => {
    api.redirectGet(id, 'configprops').then(({ data }) => {
      let beans = data?.contexts?.application?.beans
      setConfigs({
        propertySources: Object.keys(beans).map(key => {
          return { name: key, properties: flatten(beans[key].properties, beans[key].prefix) }
        }),
      })
    })
  }, [id])

  let count = 0

  function PropertySource({ values, count }: { values?: PropertiesSources[]; count: number }) {
    let innerCount = 0
    function renderKey(key: string) {
      return key.length > 65 ? (
        <>
          <ReactTooltip place='top' effect='solid' type='dark' id={`${count}-${innerCount}`}>
            {key}
          </ReactTooltip>
          <PropertySourceKey data-tip data-for={`${count}-${innerCount}`}>
            {key}
          </PropertySourceKey>
        </>
      ) : (
        <PropertySourceKey>{key}</PropertySourceKey>
      )
    }

    function renderValue(properties) {
      return properties.value !== undefined ? (
        <PropertySourceValue>
          {properties.value?.length > 600 ? properties.value.slice(0, 600) : properties.value}
        </PropertySourceValue>
      ) : (
        <PropertySourceValue>{properties}</PropertySourceValue>
      )
    }

    return (
      <>
        {values?.map(({ name, properties }) => (
          <PropertySourceContent>
            <PropertySourceHeader>{name}</PropertySourceHeader>
            {Object.keys(properties).map(key => (
              <PropertySourceItem key={`${count}-${++innerCount}`}>
                {renderKey(key)}
                {renderValue(properties[key])}
              </PropertySourceItem>
            ))}
          </PropertySourceContent>
        ))}
      </>
    )
  }

  function PropertySourceEnv() {
    return <PropertySource values={env?.propertySources} count={++count} />
  }

  function PropertySourceConfig() {
    return <PropertySource values={configs?.propertySources} count={++count} />
  }

  return (
    <Content>
      <ToolTipCss />
      <ToggleOption gap={0}>
        <NavTabStyled to={`${url}/config`}>Env</NavTabStyled>
        <NavTabStyled to={`${url}/props`}>Config</NavTabStyled>
      </ToggleOption>

      <div> Active profiles: {env?.activeProfiles.join(', ')}</div>
      <Switch>
        <Route exact path={`${path}`} render={() => <Redirect to={`${url}/config`} />} />
        <Route path={`${path}/config`} component={PropertySourceEnv} />
        <Route path={`${path}/props`} component={PropertySourceConfig} />
      </Switch>
    </Content>
  )
}

const ToolTipCss = createGlobalStyle`
 .__react_component_tooltip.__react_component_tooltip.show {
  opacity: 1;
  font-size: 16px;
  border-color: ${props => props.theme.primaryColor};

  &.place-top::before {
    border-top-color: ${props => props.theme.primaryColor};
  }  
  &.place-right::before {
    border-right-color: ${props => props.theme.primaryColor};
  }
 }
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

const Content = styled.div`
  padding: 20px;
`
const PropertySourceHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid ${props => props.theme.secondaryColor};
  margin: 0px 5px;
`
const PropertySourceContent = styled.div`
  ${BorderRadius}
  margin: 10px 0px;
  text-align: left;

  > div:last-child {
    border-bottom: none;
  }
`
const PropertySourceItem = styled(FlexBox)`
  padding: 5px;
  font-size: 16px;
  padding: 8px 10px;
  border-bottom: 2px solid ${props => props.theme.secondaryColor};
  margin: 0px 15px;
`
const PropertySourceKey = styled.div`
  max-width: 470px;
  min-width: 470px;
`
const PropertySourceValue = styled.div`
  width: 100%;
  padding-left: 10px;
`
