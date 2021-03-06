import moment from 'moment'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import api from '../../api'
import { FlexBox } from '../../components/FlexBox'
import { Input } from '../../components/Input'
import { InstanceParams } from '../InstanceMenu'
import { ThreadList } from './ThreadList'

export type StackTraceDTO = {
  classLoaderName?: string
  className: string
  fileName?: string
  lineNumber: number
  methodName: string
  moduleName?: string
  moduleVersion?: string
  nativeMethod: boolean
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
  }
  printStackTrace(lenght: number = this.stackTrace.length) {
    return this.stackTrace?.slice(0, lenght)?.map(st => `${st.className}.${st.methodName}(${st.fileName}:${st.lineNumber})`)
  }
  changed(thread?: ThreadDTO) {
    return this.printStackTrace(1)[0] !== thread?.printStackTrace(1)[0] || this.threadState !== thread?.threadState
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
  const [monitor, setMonitor] = useState<{ threads: ThreadOverTime[] }>({ threads: [] })
  const [timeStart, setTimeStart] = useState(moment.now() - 1000)
  const [timeEnd, setTimeEnd] = useState(moment.now() + 5 * 60 * 1000 - 1000)
  const [filterThreads, setFilterThreads] = useState<string>()
  const [filterPackages, setFilterPackages] = useState<string>()
  const requesting = useRef(false)

  const updateThreads = ({ threads }: { threads: ThreadOverTime[] }, newThreads: ThreadDTO[]) => {
    let currentTime = moment.now()
    let newItem = false

    newThreads.forEach(nt => {
      let threadIntervals = threads.find(t => t.threadId === nt.threadId)?.threadIntervals
      let ntdto = new ThreadDTO(nt)
      if (threadIntervals) {
        let lastInterval = threadIntervals.pop()
        if (lastInterval.thread.changed(ntdto)) {
          threadIntervals.push(lastInterval)
          threadIntervals.push({ start: lastInterval.end, end: currentTime, thread: ntdto })
        } else {
          threadIntervals.push({ ...lastInterval, end: currentTime })
        }
      } else {
        threads.push({
          threadId: nt.threadId,
          threadName: nt.threadName,
          threadIntervals: [{ start: currentTime - 1000, end: currentTime, thread: ntdto }],
        })
        newItem = true
      }
    })
    return { threads: newItem ? threads.sort(sort) : threads }
  }

  // prettier-ignore
  useEffect(() => {
    let timer = setInterval(() => {
      if (requesting.current) {
        return
      }
      requesting.current = true
      api.threadDump(id)
        .then(({ data }: { data: { threads: ThreadDTO[] } }) => {
          setMonitor(monitor => updateThreads(monitor, data.threads))
        })
        .finally(() => (requesting.current = false))
    }, 2 * 1000)
    return () => clearTimeout(timer)
  }, [id, setMonitor])

  useEffect(() => {
    let timer = setInterval(() => {
      const now = moment.now()
      setTimeEnd(oldTimeEnd => {
        if (now > oldTimeEnd) {
          const newTimeStart = now - 5 * 60 * 1000
          setTimeStart(newTimeStart)
          setMonitor(monitor => {
            monitor.threads.forEach(t => (t.threadIntervals = t.threadIntervals.filter(ti => ti.end > newTimeStart)))
            return { threads: monitor.threads.filter(t => t.threadIntervals.length > 0) }
          })
          return now
        }
        return oldTimeEnd
      })
    }, 2 * 1000)
    return () => clearTimeout(timer)
  }, [setTimeStart, setTimeEnd])

  // prettier-ignore
  const filters = useMemo(() => filterThreads?.toLowerCase().split('|').map(f => f.trim()), [filterThreads])

  const threadsFiltered = useMemo(
    () =>
      filterThreads ? monitor.threads.filter(t => filters.find(f => t.threadName.toLowerCase().includes(f))) : monitor.threads,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, monitor.threads.length]
  )
  return (
    <>
      <FlexBox justifyContent='flex-start'>
        <Input width='400px' onChange={e => setFilterThreads(e.target.value)} placeholder='Filter threads, pipe for logical or' />
        <Input
          width='400px'
          onChange={e => setFilterPackages(e.target.value)}
          placeholder='Filter packages starts with for tooltip'
        />
      </FlexBox>
      <div style={{ height: '10px' }} />
      <ThreadList timeStart={timeStart} timeEnd={timeEnd} threads={threadsFiltered} filterPackages={filterPackages} />
    </>
  )
}
