import React from 'react'
import styled from 'styled-components'
import { ToolTip } from '../../components/ToolTip'
import { ThreadInterval } from './Thread'
import { threaNameWidth } from './ThreadList'

type ThreadItemIntervalProps = {
  ti: ThreadInterval
  threadId: number
  onClick: (ti: ThreadInterval) => void
  timeStart: number
  timeEnd: number
  pixelInterval: number
}

export function ThreadItemInterval({ ti, threadId, onClick, timeStart, timeEnd, pixelInterval }: ThreadItemIntervalProps) {
  const timeInterval = timeEnd - timeStart

  const percenteOfIntervalStart = (ti.start - timeStart) / timeInterval
  let pixelStart = percenteOfIntervalStart * pixelInterval + threaNameWidth
  pixelStart = pixelStart < threaNameWidth ? threaNameWidth : pixelStart

  const percenteOfIntervalEnd = (ti.end - timeStart) / timeInterval
  const pixelEnd = percenteOfIntervalEnd * pixelInterval - (pixelStart - threaNameWidth) - 3

  let state = 'yellow'
  if (ti.thread.threadState === 'RUNNABLE') {
    state = 'green'
  } else if (ti.thread.threadState === 'BLOCKED') {
    state = 'red'
  }

  return (
    <>
      {ti.thread.brStackTrace && <ToolTip id={`${threadId}-${ti.start}`}>{ti.thread.brStackTrace}</ToolTip>}
      <ItemInterval
        key={`${threadId}-${ti.start}`}
        data-tip
        data-for={`${threadId}-${ti.start}`}
        start={pixelStart}
        end={pixelEnd}
        state={state}
        onClick={() => onClick(ti)}
      />
    </>
  )
}

type ItemIntervalProps = { start: number; end: number; state: string }

const ItemInterval = styled.div.attrs<ItemIntervalProps>(props => ({
  style: {
    left: `${props.start}px`,
    width: `${props.end}px`,
    backgroundColor: props.state,
  },
}))<ItemIntervalProps>`
  position: absolute;
  height: 20px;

  &:hover {
    cursor: pointer;
    background-color: var(--secondaryColor);
  }

  &::marker {
    content: '';
  }
`
