import moment from 'moment'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { InstaceParams } from '../InstanceMenu'

class StackTraceDTO {
  classLoaderName?: string
  className: string
  fileName?: string
  lineNumber: number
  methodName: string
  moduleName?: string
  moduleVersion?: string
  nativeMethod: boolean
  public constructor(init?: Partial<StackTraceDTO>) {
    Object.assign(this, init)
  }
  print() {
    return `${this.className}.${this.methodName}(${this.fileName}:${this.lineNumber})`
  }
}

class ThreadDTO {
  threadId: number
  threadName: string
  threadState: 'NEW' | 'RUNNABLE' | 'BLOCKED' | 'WAITING' | 'TIMED_WAITING' | 'TERMINATED'
  priority?: number
  daemon?: boolean
  inNative: boolean
  suspended: boolean
  blockedCount: number
  blockedTime: number
  waitedCount: number
  lockName?: string
  lockOwnerName?: string
  lockOwnerId: number
  waitedTime: number
  lockInfo?: { className: string; identityHashCode: number }
  stackTrace: StackTraceDTO[]
  public constructor(init?: Partial<ThreadDTO>) {
    Object.assign(this, init)
    this.stackTrace = init?.stackTrace.map(st => new StackTraceDTO({ ...st }))
  }
  printStackTrace() {
    return this.stackTrace.map(sT => sT.print())
  }
  stackTraceChanged(thread: ThreadDTO) {
    return this.stackTrace?.[0]?.print() !== thread.stackTrace?.[0]?.print()
  }
}

type ThreadOverTime = {
  threadId: number
  threadName: string
  threadIntervals: {
    start: number
    end: number
    thread: ThreadDTO
  }[]
}

export function Thread() {
  const { id } = useParams<InstaceParams>()
  const [threads, setThreads] = useState<ThreadOverTime[]>([])
  const [timeStart, setTimeStart] = useState(moment.now() - 1000)
  const [timeEnd, setTimeEnd] = useState(moment.now() + 5 * 60 * 1000 - 1000)

  useEffect(() => {
    let timer = setInterval(() => {
      api
        .redirectGet(id, `threaddump`, { headers: { Accept: 'application/json' } })
        .then(({ data }: { data: { threads: ThreadDTO[] } }) => {
          setThreads(oldIntervals => updateThreads(oldIntervals, data.threads))
        })
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [id, setThreads])

  useEffect(() => {
    let timer = setInterval(() => {
      const now = moment.now()
      if (now > timeEnd) {
        setTimeStart(now - 5 * 60 * 1000)
        setTimeEnd(now)
      }
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [timeEnd, setTimeStart, setTimeEnd])

  function updateThreads(oldIntervals: ThreadOverTime[], newThreads: ThreadDTO[]) {
    let newIntervals = [...oldIntervals]
    let currentTime = moment.now()
    let newItem = false
    newThreads.forEach(nt => {
      let threadIntervals = newIntervals.find(t => t.threadId === nt.threadId)?.threadIntervals
      let ntdto = new ThreadDTO(nt)
      if (threadIntervals) {
        let lastInterval = threadIntervals.pop()
        if (lastInterval.thread.stackTraceChanged(ntdto)) {
          threadIntervals.push(lastInterval)
          threadIntervals.push({ start: lastInterval.end, end: currentTime, thread: ntdto })
        } else {
          threadIntervals.push({ ...lastInterval, end: currentTime })
        }
      } else {
        newIntervals.push({
          threadId: nt.threadId,
          threadName: nt.threadName,
          threadIntervals: [{ start: currentTime - 1000, end: currentTime, thread: ntdto }],
        })
        newItem = true
      }
    })
    return newItem ? newIntervals.sort((a, b) => (a.threadName > b.threadName ? 1 : -1)) : newIntervals
  }

  return (
    <ul>
      {threads?.map(thread => (
        <ItemList timeStart={timeStart} timeEnd={timeEnd} thread={thread} />
      ))}
    </ul>
  )
}

function ItemList({ thread, timeStart, timeEnd }: { thread: ThreadOverTime; timeStart: number; timeEnd: number }) {
  const [width, setWidth] = useState(null)

  const pixelInterval = width - 250

  const interval = timeEnd - timeStart

  const div = useCallback(node => {
    setWidth(node?.getBoundingClientRect().width)
  }, [])

  return (
    <ItemListStyle ref={div} key={thread.threadId} justifyContent='flex-start' wrap='nowrap' gap={0}>
      <ItemName>{thread.threadName}</ItemName>
      {thread.threadIntervals.map(ti => {
        const percenteOfInterval = (ti.start - timeStart) / interval
        const pixelStart = percenteOfInterval * pixelInterval + 250

        const percenteOfIntervalEnd = (ti.end - timeStart) / interval
        const pixelEnd = percenteOfIntervalEnd * pixelInterval - (pixelStart - 250)

        let state = 'yellow'
        if (ti.thread.threadState === 'RUNNABLE') {
          state = 'green'
        } else if (ti.thread.threadState === 'BLOCKED') {
          state = 'red'
        }

        return <ItemInterval start={pixelStart} end={pixelEnd} state={state} />
      })}
    </ItemListStyle>
  )
}

const ItemName = styled.div`
  min-width: 250px;
  max-width: 250px;
  white-space: nowrap;
`

const ItemInterval = styled.div<{ start: number; end: number; state: string }>`
  position: absolute;
  left: ${p => p.start}px;
  width: ${p => p.end}px;
  background-color: ${p => p.state};
  border-right: 2px solid var(--secondaryColor);
  height: 20px;
`

const ItemListStyle = styled(FlexBox)<FlexBoxProps>`
  padding: 5px;
  text-align: left;
  width: 100%;
  position: relative;

  border-bottom: 2px solid var(--secondaryColor);

  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }

  &::marker {
    content: '';
  }
`
