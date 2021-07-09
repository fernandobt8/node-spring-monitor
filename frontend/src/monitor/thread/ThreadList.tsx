import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { FlexBox } from '../../components/FlexBox'
import { ToolTip } from '../../components/ToolTip'
import { ThreadDTO, ThreadInterval, ThreadOverTime } from './Thread'
import { ThreadItemInfo } from './ThreadItemInfo'
import { ThreadItemInterval } from './ThreadItemInterval'

export const threaNameWidth = 250

export function ThreadList({ timeStart, timeEnd, threads }: { timeStart: number; timeEnd: number; threads: ThreadOverTime[] }) {
  return (
    <ul>
      {threads?.map(thread => (
        <ItemList key={thread.threadId} timeStart={timeStart} timeEnd={timeEnd} thread={thread} />
      ))}
    </ul>
  )
}

function ItemList({ thread, timeStart, timeEnd }: { thread: ThreadOverTime; timeStart: number; timeEnd: number }) {
  const [width, setWidth] = useState(null)
  const [threadStack, setThreadStack] = useState<ThreadDTO>()

  const div = useCallback(node => {
    setWidth(node?.getBoundingClientRect().width)
  }, [])

  const onIntervalClick = (ti: ThreadInterval) =>
    ti.thread.stackTraceChanged(threadStack) ? setThreadStack(ti.thread) : setThreadStack(null)

  return (
    <ThreadItem>
      <FlexBox ref={div} justifyContent='flex-start' wrap='nowrap' gap={0} style={{ position: 'relative' }}>
        {thread.threadName.length > 30 && <ToolTip id={thread.threadId.toString()}>{thread.threadName}</ToolTip>}
        <ItemName data-tip data-for={thread.threadId.toString()}>
          {thread.threadName}
        </ItemName>
        {thread.threadIntervals.map(ti => (
          <ThreadItemInterval
            key={`${thread.threadId}-${ti.start}`}
            ti={ti}
            threadId={thread.threadId}
            onClick={onIntervalClick}
            timeStart={timeStart}
            timeEnd={timeEnd}
            pixelInterval={width - threaNameWidth}
          />
        ))}
      </FlexBox>
      {threadStack && <ThreadItemInfo thread={threadStack} />}
    </ThreadItem>
  )
}

const ThreadItem = styled.div`
  border-bottom: 2px solid var(--secondaryColor);
  padding: 5px;
  text-align: left;
  width: 100%;
`

const ItemName = styled.div`
  min-width: ${threaNameWidth}px;
  max-width: ${threaNameWidth}px;
  white-space: nowrap;
  font-weight: bold;
`
