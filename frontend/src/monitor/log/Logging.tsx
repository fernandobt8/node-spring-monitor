import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { InstanceParams } from '../InstanceMenu'

export function Logging() {
  const { id } = useParams<InstanceParams>()
  const [log, setLog] = useState<string>()

  useEffect(() => {
    api.redirectGet(id, 'logfile').then(({ data }) => setLog(data))
  }, [id])

  return <Log>{log}</Log>
}

const Log = styled.p`
  white-space: pre;
  text-align: left;
  overflow: auto;
  height: calc(100vh - 190px);
`
