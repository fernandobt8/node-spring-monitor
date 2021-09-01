import React from 'react'
import { JmxDomainProp } from './Jmx'

export function JmxDomainOp(props: JmxDomainProp) {
  return (
    <ul>
      {Object.keys(props.op).map(key => (
        <li key={key}>{key}</li>
      ))}
    </ul>
  )
}
