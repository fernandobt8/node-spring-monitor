import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import ReactTooltip from 'react-tooltip'
import styled, { createGlobalStyle, ThemeContext } from 'styled-components'
import api from '../../api'
import { flatten } from '../../utils/objectUtils'
import { InstaceParams } from '../InstanceMenu'

type EnvironmentDTO = {
  activeProfiles?: string[]
  propertySources: {
    name: string
    properties: { [key: string]: string | { value: string } }
    count?: number
  }[]
}

export function Environment() {
  const { id } = useParams<InstaceParams>()
  const [env, setEnv] = useState<EnvironmentDTO>()
  const [configs, setConfigs] = useState<EnvironmentDTO>()
  const [tabSelected, setTabSelected] = useState<number>(0)
  const theme = useContext(ThemeContext)

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

  const renderToggle = (tab: number, name: string) => (
    <div
      style={{ backgroundColor: tabSelected === tab ? theme.secondaryColor : theme.backgroundColor }}
      onClick={() => setTabSelected(tab)}>
      {name}
    </div>
  )

  let count = 0
  return (
    <Content>
      <ToolTipCss />
      <ToggleOption>
        {renderToggle(0, 'Env')}
        {renderToggle(1, 'Config')}
      </ToggleOption>

      <div> Active profiles: {env?.activeProfiles.join(', ')}</div>

      {tabSelected === 0 && env?.propertySources.map(i => <PropertySource key={i.name} {...i} count={++count} />)}
      {tabSelected === 1 && configs?.propertySources.map(i => <PropertySource key={i.name} {...i} count={++count} />)}
    </Content>
  )
}

function PropertySource({ name, properties, count }) {
  let innerCount = 0
  return (
    <PropertySourceContent>
      <PropertySourceHeader>{name}</PropertySourceHeader>
      {Object.keys(properties).map(key => (
        <PropertySourceItem key={`${count}-${++innerCount}`}>
          {renderKey(key)}
          {renderValue(properties[key])}
        </PropertySourceItem>
      ))}
    </PropertySourceContent>
  )

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

const ToggleOption = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: 2px solid ${props => props.theme.primaryColor};
  width: fit-content;
  margin: auto;
  > div {
    padding: 10px;
    cursor: pointer;
  }
`
const Content = styled.div`
  padding: 20px;
`
const PropertySourceValue = styled.div`
  width: 100%;
  padding-left: 10px;
`

const PropertySourceKey = styled.div`
  max-width: 470px;
  min-width: 470px;
`

const PropertySourceItem = styled.div`
  padding: 5px;
  font-size: 16px;
  padding: 8px 10px;
  border-bottom: 2px solid ${props => props.theme.secondaryColor};
  margin: 0px 15px;
  display: flex;
  flex-direction: row;
`

const PropertySourceHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid ${props => props.theme.secondaryColor};
  margin: 0px 5px;
`

const PropertySourceContent = styled.div`
  border: 2px solid ${props => props.theme.secondaryColor};
  border-radius: 2px;
  margin: 10px 0px;

  > div:last-child {
    border-bottom: none;
  }
`
