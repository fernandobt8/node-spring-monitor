import React, { useEffect, useState } from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import api from '../../api'
import { FlexBox } from '../../components/FlexBox'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomain } from './JmxDomain'

export type JmxDomainPropAttrDTO = {
  type: string
  desc: string
  rw: boolean
  value: string
  hint: string
}

export type JmxDomainPropOpDTO = {
  args: {
    type: string
    name: string
    desc: string
  }[]
  ret: string
  desc: string
}

export type JmxDomainProp = {
  props: string[][]
  namePath: string
  domain: string
  mbean: string
  attr: { [attr: string]: JmxDomainPropAttrDTO }
  attrLoaded: boolean
  op: { [op: string]: JmxDomainPropOpDTO | JmxDomainPropOpDTO[] }
}

export type JmxDomainDTO = {
  [prop: string]: JmxDomainProp
}

type JmxDTO = {
  [domain: string]: JmxDomainDTO
}

export function Jmx() {
  const { id } = useParams<InstanceParams>()
  const { path, url } = useRouteMatch()
  const [jmx, setJmx] = useState<JmxDTO>()

  useEffect(() => {
    api.redirectGet(id, 'jolokia/list', { Accept: 'application/json' }).then(({ data }) => {
      const jmxDto: JmxDTO = data.value
      Object.entries(jmxDto).forEach(([domainKey, domain]) => {
        const counts: { [key: string]: number } = {}
        Object.entries(domain).forEach(([propKey, prop]) => {
          prop.domain = domainKey
          prop.mbean = propKey
          prop.namePath = encodeURIComponent(propKey.replaceAll(/\s|"|,|=/g, ''))
          prop.props = propKey.split(',').map(v => v.split('='))
          prop.props.forEach(attr => (counts[attr[0]] = counts[attr[0]] ? counts[attr[0]] + 1 : 1))
        })
        // prettier-ignore
        Object.values(domain).forEach(propValue => {
          propValue.props.sort((a, b) => 
            a[0] === 'type' ? -1
            : b[0] === 'type' ? 1
            : counts[a[0]] === counts[b[0]] ? a[0] > b[0] ? 1 : -1
            : counts[a[0]] > counts[b[0]] ? -1 : 1
          )
        })
      })
      setJmx(data.value)
    })
  }, [id, setJmx])

  return (
    <FlexBox justifyContent='flex-start' alignItems='flex-start' wrap='nowrap'>
      <ul style={{ flex: '0 0 auto' }}>
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
