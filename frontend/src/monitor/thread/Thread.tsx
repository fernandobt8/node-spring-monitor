import moment from 'moment'
import React, { useEffect, useState } from 'react'
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

//`${className}.${methodName}(${fileName}:${lineNumber})
//java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)

export function Thread() {
  const { id } = useParams<InstaceParams>()
  const [threads, setThreads] = useState<ThreadOverTime[]>([])

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

  function updateThreads(oldIntervals: ThreadOverTime[], newThreads: ThreadDTO[]) {
    let newIntervals = [...oldIntervals]
    let currentTime = moment.now()
    newThreads.forEach(nt => {
      let threadInterval = newIntervals.find(t => t.threadId === nt.threadId)
      if (threadInterval) {
        let lastInterval = threadInterval.threadIntervals.pop()
        let ntdto = new ThreadDTO(nt)
        if (lastInterval.thread.stackTraceChanged(new ThreadDTO(ntdto))) {
          threadInterval.threadIntervals.push(lastInterval)
          threadInterval.threadIntervals.push({ start: lastInterval.end, end: currentTime, thread: ntdto })
        } else {
          threadInterval.threadIntervals.push({ ...lastInterval, end: currentTime })
        }
      } else {
        newIntervals.push({
          threadId: nt.threadId,
          threadName: nt.threadName,
          threadIntervals: [{ start: currentTime - 1000, end: currentTime, thread: new ThreadDTO(nt) }],
        })
      }
    })
    return newIntervals.sort((a, b) => (a.threadName > b.threadName ? 1 : -1))
  }

  return (
    <ul>
      {threads?.map(thread => (
        <ItemListStyle key={thread.threadId} justifyContent='flex-start'>
          <div>{thread.threadName}</div>
          {thread.threadIntervals.map(ti => {
            return (
              <>
                <div>{ti.start}</div>
                <div>{ti.end}</div>
              </>
            )
          })}
        </ItemListStyle>
      ))}
    </ul>
  )
}

const ItemListStyle = styled(FlexBox)<FlexBoxProps>`
  padding: 5px;
  text-align: left;
  width: 100%;

  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }

  &::marker {
    content: '';
  }
`
