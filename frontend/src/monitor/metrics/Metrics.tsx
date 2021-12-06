import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { Button } from '../../components/Button'
import { FlexBox } from '../../components/FlexBox'
import { Select } from '../../components/Select'
import { InstanceParams } from '../InstanceMenu'
import { useWatchMetrics } from './useWatchMetric'
import { WatchMetric } from './WatchMetric'

type TagDTO = {
  tag: string
  values: string[]
}

type MetricsDto = {
  name: string
  availableTags: TagDTO[]
}

export type WatchTagDto = {
  value?: string
  baseUnit?: string
  tags: string[]
}

export type WatchMetricDto = {
  name: string
  wTags: WatchTagDto[]
}

export function Metrics() {
  const { id } = useParams<InstanceParams>()
  const [metrics, setMetrics] = useState()
  const [selectedMetric, setSelectedMetric] = useState<MetricsDto>()
  const [selectedTags, setSelectedTags] = useState<{ [k: string]: any }>({})
  const [watchMetrics, setWatchMetrics] = useWatchMetrics(id)

  useEffect(() => {
    api.metrics.list(id).then(({ data }) => setMetrics(data.names.map(v => ({ label: v, value: v }))))
  }, [id])

  const onChangeMetric = value =>
    api.metrics.get(id, value.value).then(({ data }) => {
      setSelectedTags({})
      setSelectedMetric(data)
    })

  const add = () =>
    setWatchMetrics({
      id,
      type: 'add',
      dto: {
        name: selectedMetric.name,
        tags: Object.entries(selectedTags)
          .filter(([k, v]) => v)
          .map(([k, v]) => `${k}:${v.value}`),
      },
    })

  const remove = (name: string, tags: string[]) => setWatchMetrics({ id, type: 'delete', dto: { name, tags } })

  return (
    <FlexBox justifyContent='flex-start' alignItems='flex-start'>
      <div style={{ flex: '0 0 auto' }}>
        <Select width='400px' options={metrics} onChange={onChangeMetric} />
        <Box flexDirection='column' gap={10}>
          {selectedMetric?.availableTags.map(tag => (
            <Select
              key={tag.tag}
              width='100%'
              isClearable={true}
              placeholder={tag.tag}
              value={selectedTags[tag.tag] || null}
              onChange={value => setSelectedTags({ ...selectedTags, [tag.tag]: value })}
              options={tag.values.map(v => ({ label: v, value: v }))}
            />
          ))}
          <Button style={{ alignSelf: 'flex-end' }} onClick={add}>
            Execute
          </Button>
        </Box>
      </div>
      <ol style={{ flex: '1 1 auto' }}>
        {watchMetrics.map(wm => (
          <WatchMetric key={wm.name} dto={wm} remove={remove} />
        ))}
      </ol>
    </FlexBox>
  )
}

const Box = styled(FlexBox)`
  box-shadow: 0 0 2px 2px var(--blueColor);
  margin-top: 10px;
  text-align: left;
  padding: 10px;
`
