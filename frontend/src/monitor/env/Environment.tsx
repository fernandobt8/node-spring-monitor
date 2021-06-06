import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { InstaceParams } from '../InstanceMenu'

type PropertyDTO = {
  value: string
  origin: string
}

type PropertiesDTO = {
  [key: string]: PropertyDTO
}

type PropertySourceDTO = {
  name: string
  properties: PropertiesDTO
}

type EnvironmentDTO = {
  activeProfiles: string[]
  propertySources: PropertySourceDTO[]
}

export function Environment() {
  const { id } = useParams<InstaceParams>()
  const [env, setEnv] = useState<EnvironmentDTO>()

  useEffect(() => {
    api
      .get(`/redirect/instances/${id}`, {
        params: {
          path: 'env',
        },
      })
      .then(({ data }) => setEnv(data))
  }, [id])

  return (
    <div>
      {env?.activeProfiles.map(i => (
        <div>{i}</div>
      ))}
      {env?.propertySources.map(i => (
        <PropertySource {...i} />
      ))}
    </div>
  )
}

function PropertySource({ name, properties }: PropertySourceDTO) {
  return (
    <div>
      <div>{`name: ${name}`}</div>
      {Object.keys(properties).map(key => (
        <div>{`${key} : ${properties[key].value}`}</div>
      ))}
    </div>
  )
}
