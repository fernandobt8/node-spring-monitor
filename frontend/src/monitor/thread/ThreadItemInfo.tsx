import React from 'react'
import styled from 'styled-components'
import { FlexBox } from '../../components/FlexBox'
import { ThreadDTO } from './Thread'

export function ThreadItemInfo({ thread }: { thread: ThreadDTO }) {
  return (
    <ThreadItemInfoContent>
      <ThreadInfo justifyContent='flex-start' alignItems='flex-start'>
        <FlexBox>
          <FlexBox alignItems='flex-start' flexDirection='column' gap={10}>
            <div>Thread id:</div>
            <div>Thread name:</div>
            <div>Thread State:</div>
          </FlexBox>
          <FlexBox alignItems='flex-start' flexDirection='column' gap={10}>
            <div>{thread.threadId}</div>
            <div>{thread.threadName}</div>
            <div>{thread.threadState}</div>
          </FlexBox>
        </FlexBox>
        <FlexBox>
          <FlexBox alignItems='flex-start' flexDirection='column' gap={10}>
            <div>Waited count:</div>
            <div>Waited time:</div>
            <div>Blocked count:</div>
            <div>Blocked time:</div>
          </FlexBox>
          <FlexBox alignItems='flex-start' flexDirection='column' gap={10}>
            <div>{thread.waitedCount}</div>
            <div>{thread.waitedTime}</div>
            <div>{thread.blockedCount}</div>
            <div>{thread.blockedTime}</div>
          </FlexBox>
        </FlexBox>
        <FlexBox>
          <FlexBox alignItems='flex-start' flexDirection='column' gap={10}>
            <div>Lock name:</div>
            <div>Lock owner id:</div>
            <div>Lock owner name:</div>
          </FlexBox>
          <FlexBox alignItems='flex-start' flexDirection='column' gap={10}>
            <div>{thread.lockName || '-'}</div>
            <div>{thread.lockOwnerId}</div>
            <div>{thread.lockOwnerName || '-'}</div>
          </FlexBox>
        </FlexBox>
      </ThreadInfo>
      <StackTraceStyle>{thread.printStackTrace().join('\n')}</StackTraceStyle>
    </ThreadItemInfoContent>
  )
}

const ThreadInfo = styled(FlexBox)`
  background-color: var(--secondaryColor);
  border-bottom: 2px solid var(--backgroundColor);
  padding: 10px;
`
const ThreadItemInfoContent = styled.div`
  padding: 5px 10px 0px;
  font-size: 14px;
`
const StackTraceStyle = styled.p`
  white-space: pre;
  text-align: left;
  overflow: auto;
  max-height: 230px;
  background-color: var(--secondaryColor);
  padding: 10px 20px;
`
