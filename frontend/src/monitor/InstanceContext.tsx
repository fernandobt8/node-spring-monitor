import { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../api'
import { InstanceDTO } from '../instances/InstancesListView'
import { InstanceParams } from './InstanceMenu'

const InstanceContext = createContext<InstanceDTO>(null)

export function InstanceProvider({ children }) {
  const { id } = useParams<InstanceParams>()
  const [instance, setInstance] = useState<InstanceDTO>()

  useEffect(() => {
    api.instance.get(id).then(({ data }) => setInstance(data))
  }, [id])

  return <InstanceContext.Provider value={instance}>{children}</InstanceContext.Provider>
}

export const useInstanceDto = () => useContext(InstanceContext)
