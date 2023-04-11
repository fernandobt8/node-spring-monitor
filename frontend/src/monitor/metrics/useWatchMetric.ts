import { useEffect, useReducer, useRef } from 'react'
import api from '../../api'
import { WatchMetricDto } from './Metrics'

type Action = {
  id: string
  type: 'request' | 'refresh' | 'add' | 'delete'
  dto?: { name: string; tags: string[] }
  onFinish?: () => void
}

const storageKey = 'watchMetrics'

function init(initialState) {
  const item = window.localStorage.getItem(storageKey)
  if (item) {
    const array: WatchMetricDto[] = JSON.parse(item)
    array.forEach(i => i.wTags.forEach(wt => (wt.value = '-')))
    return array
  }
  return initialState
}

function reducer(state: WatchMetricDto[], { id, type, dto, onFinish }: Action) {
  switch (type) {
    case 'request': {
      const requests = state.map(wm =>
        wm.wTags.map(wTag =>
          api.metrics
            .get(id, wm.name, wTag.tags)
            .then(({ data }) => {
              wTag.baseUnit = data.baseUnit
              wTag.value = data.measurements[0].value
            })
            .catch(error => error)
        )
      )
      Promise.all(requests).finally(onFinish)
      return state
    }
    case 'add': {
      let findWatchMetric = state.find(m => m.name === dto.name)
      if (!findWatchMetric) {
        findWatchMetric = { name: dto.name, wTags: [] }
        state.push(findWatchMetric)
      }

      if (!findWatchMetric?.wTags.find(wTags => wTags.tags.join() === dto.tags.join())) {
        findWatchMetric.wTags.push({ tags: dto.tags, value: '-' })
        window.localStorage.setItem(storageKey, JSON.stringify(state))
        return [...state]
      }
      return state
    }
    case 'delete': {
      const findWatchMetric = state.find(wm => wm.name === dto.name)
      if (dto.tags.length > 0) {
        findWatchMetric.wTags.delete(wTags => wTags.tags.join() === dto.tags.join())
      } else {
        state.delete(findWatchMetric)
      }
      window.localStorage.setItem(storageKey, JSON.stringify(state))
      return [...state]
    }
    case 'refresh': {
      return [...state]
    }
  }
}

export function useWatchMetrics(id: string): [WatchMetricDto[], (action: Action) => void] {
  const [watchMetrics, setWatchMetrics] = useReducer<
    (state: WatchMetricDto[], newState: Action) => WatchMetricDto[],
    WatchMetricDto[]
  >(reducer, [], init)
  const requesting = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (requesting.current) return
      requesting.current = true
      setWatchMetrics({
        id,
        type: 'request',
        onFinish: () => {
          requesting.current = false
          setWatchMetrics({ id, type: 'refresh' })
        },
      })
    }, 3 * 1000)

    return () => clearInterval(interval)
  }, [id])

  return [watchMetrics, setWatchMetrics]
}
