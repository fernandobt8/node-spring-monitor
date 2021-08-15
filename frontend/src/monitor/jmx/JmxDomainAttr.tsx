import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { InstanceParams } from '../InstanceMenu'
import { JmxDomainProp } from './Jmx'

export function JmxDomainAttr(props: JmxDomainProp) {
  const { id } = useParams<InstanceParams>()
  const [jmxProp, setJmxProp] = useState<JmxDomainProp>(props)

  useEffect(() => {
    api
      .redirectPost(id, `jolokia?`, {
        config: { ignoreErrors: true },
        mbean: `${props.domain}:${props.mbean}`,
        type: 'read',
      })
      .then(({ data }) => {
        setJmxProp(old => {
          const newJmxProp = { ...old }
          Object.keys(data?.value).forEach(key => (newJmxProp.attr[key] ? (newJmxProp.attr[key].value = data.value[key]) : null))
          return newJmxProp
        })
      })
  }, [id, props.domain, props.mbean, setJmxProp])

  return (
    <ul>
      {Object.keys(jmxProp.attr).map(key => (
        <li key={key}>{`${key} : ${JSON.stringify(jmxProp.attr[key].value)}`}</li>
      ))}
    </ul>
  )
}
