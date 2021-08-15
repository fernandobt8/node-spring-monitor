import React from 'react'
import styled from 'styled-components'
import { FlexBox } from '../../components/FlexBox'
import { ToolTip } from '../../components/ToolTip'
import { colors } from '../../theme/colors'
import { BorderRadius } from '../../theme/styles'
import { PropertiesSources } from './Environment'

export function PropertySource({ values, count }: { values?: PropertiesSources[]; count: number }) {
  let innerCount = 0

  function renderKey(key: string) {
    return key.length > 63 ? (
      <>
        <ToolTip id={`${count}-${innerCount}`}>{key}</ToolTip>
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
        <PropertySourceContent borderColor={colors.secondary} key={name}>
          <PropertySourceHeader>{name}</PropertySourceHeader>
          {Object.keys(properties).map(key => (
            <PropertySourceItem key={`${count}-${++innerCount}`} justifyContent='flex-start' wrap='nowrap' gap={0}>
              {renderKey(key)}
              {renderValue(properties[key])}
            </PropertySourceItem>
          ))}
        </PropertySourceContent>
      ))}
    </>
  )
}

const PropertySourceHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 2px solid var(--secondaryColor);
  margin: 0px 5px;
`
const PropertySourceContent = styled.div<{ borderColor: string }>`
  ${BorderRadius}
  margin: 10px 0px;

  > div:last-child {
    border-bottom: none;
  }
`
const PropertySourceItem = styled(FlexBox)`
  font-size: 16px;
  padding: 8px 10px;
  border-bottom: 2px solid var(--secondaryColor);
  margin: 0px 15px;
`
const PropertySourceKey = styled.div`
  max-width: 470px;
  min-width: 470px;
  white-space: nowrap;
`
const PropertySourceValue = styled.div`
  width: 100%;
  padding-left: 10px;
`
