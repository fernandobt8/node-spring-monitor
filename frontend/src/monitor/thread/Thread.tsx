import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { FlexBox } from '../../components/FlexBox'
import { Input } from '../../components/Input'
import { InstanceParams } from '../InstanceMenu'
import { ThreadList } from './ThreadList'

export class StackTraceDTO {
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

export class ThreadDTO {
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
  stackTraceChanged(thread?: ThreadDTO) {
    return this.stackTrace?.[0]?.print() !== thread?.stackTrace?.[0]?.print()
  }
}

export type ThreadInterval = {
  start: number
  end: number
  thread: ThreadDTO
}

export type ThreadOverTime = {
  threadId: number
  threadName: string
  threadIntervals: ThreadInterval[]
}

function sort(a: ThreadOverTime, b: ThreadOverTime) {
  if (a.threadName === b.threadName) {
    return a.threadId > b.threadId ? 1 : -1
  } else {
    return a.threadName > b.threadName ? 1 : -1
  }
}

export function Thread() {
  const { id } = useParams<InstanceParams>()
  const [threads, setThreads] = useState<ThreadOverTime[]>([])
  const [timeStart, setTimeStart] = useState(moment.now() - 1000)
  const [timeEnd, setTimeEnd] = useState(moment.now() + 5 * 60 * 1000 - 1000)
  const [filterThreads, setFilterThreads] = useState<string>()
  const [filterPackages, setFilterPackages] = useState<string>()

  const updateThreads = useCallback((oldThreads: ThreadOverTime[], newThreads: ThreadDTO[]) => {
    let copyThreads = [...oldThreads]
    let currentTime = moment.now()
    let newItem = false

    newThreads.forEach(nt => {
      let threadIntervals = copyThreads.find(t => t.threadId === nt.threadId)?.threadIntervals
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
        copyThreads.push({
          threadId: nt.threadId,
          threadName: nt.threadName,
          threadIntervals: [{ start: currentTime - 1000, end: currentTime, thread: ntdto }],
        })
        newItem = true
      }
    })
    return newItem ? copyThreads.sort(sort) : copyThreads
  }, [])

  useEffect(() => {
    let timer = setInterval(() => {
      api
        .redirectGet(id, `threaddump`, { headers: { Accept: 'application/json' } })
        .then(({ data }: { data: { threads: ThreadDTO[] } }) => {
          setThreads(oldIntervals => updateThreads(oldIntervals, data.threads))
        })
    }, 3 * 1000)
    return () => clearTimeout(timer)
  }, [id, setThreads, updateThreads])

  useEffect(() => {
    let timer = setInterval(() => {
      const now = moment.now()
      setTimeEnd(oldTimeEnd => {
        if (now > oldTimeEnd) {
          const newTimeStart = now - 5 * 60 * 1000
          setTimeStart(newTimeStart)
          setThreads(oldThreads => {
            const copyThreads = [...oldThreads]
            copyThreads.forEach(t => (t.threadIntervals = t.threadIntervals.filter(ti => ti.end > newTimeStart)))
            return copyThreads.filter(t => t.threadIntervals.length > 0)
          })
          return now
        }
        return oldTimeEnd
      })
    }, 2 * 1000)
    return () => clearTimeout(timer)
  }, [setTimeStart, setTimeEnd])

  const filters = filterThreads?.split('|').map(f => f.trim())
  const threadsFiltered = filterThreads ? threads.filter(t => filters.find(f => t.threadName.toLowerCase().includes(f))) : threads
  return (
    <>
      <FlexBox justifyContent='flex-start'>
        <Input
          style={{ width: '400px' }}
          onChange={e => setFilterThreads(e.target.value)}
          placeholder='Filter threads, pipe for logical or'
        />
        <Input
          style={{ width: '400px' }}
          onChange={e => setFilterPackages(e.target.value)}
          placeholder='Filter packages starts with for tooltip'
        />
      </FlexBox>
      <div style={{ height: '10px' }} />
      <ThreadList timeStart={timeStart} timeEnd={timeEnd} threads={threadsFiltered} filterPackages={filterPackages} />
    </>
  )
}
