import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { InstaceParams } from '../InstanceMenu'

export function Logging() {
  const { id } = useParams<InstaceParams>()
  const [log, setLog] = useState<string>()

  useEffect(() => {
    api.redirectGet(id, 'logfile').then(({ data }) => setLog(data))
  }, [id])

  return <div>{log}</div>
}
