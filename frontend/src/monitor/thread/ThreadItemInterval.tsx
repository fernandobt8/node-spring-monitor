import React, { useMemo } from 'react'
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
  filterPackages: string
}

const states = ['yellow', 'green', 'red', 'yellow', 'yellow', 'yellow']
const tStates = ['NEW', 'RUNNABLE', 'BLOCKED', 'WAITING', 'TIMED_WAITING', 'TERMINATED']
const findState = (tState: string) => states[tStates.indexOf(tState)]

export function ThreadItemInterval(props: ThreadItemIntervalProps) {
  const { ti, threadId, onClick, timeStart, timeEnd, pixelInterval, filterPackages: filter } = props

  const timeInterval = timeEnd - timeStart

  const percenteOfIntervalStart = (ti.start - timeStart) / timeInterval
  let pixelStart = percenteOfIntervalStart * pixelInterval + threaNameWidth
  pixelStart = pixelStart < threaNameWidth ? threaNameWidth : pixelStart

  const percenteOfIntervalEnd = (ti.end - timeStart) / timeInterval
  const pixelEnd = percenteOfIntervalEnd * pixelInterval - (pixelStart - threaNameWidth) - 3

  // prettier-ignore
  const packageHint = useMemo(() => 
      filter && ti.thread.printStackTrace().filter(st => st.startsWith(filter)).slice(0, 3).join('\n')
  , [filter, ti.thread])

  return (
    <>
      {packageHint && (
        <ToolTip id={`${threadId}-${ti.start}`}>
          <p style={{ whiteSpace: 'pre', fontSize: '14px' }}>{packageHint}</p>
        </ToolTip>
      )}
      <ItemInterval
        key={`${threadId}-${ti.start}`}
        data-tip
        data-for={`${threadId}-${ti.start}`}
        start={pixelStart}
        end={pixelEnd}
        state={findState(ti.thread.threadState)}
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
  },
}))<ItemIntervalProps>`
  position: absolute;
  height: 20px;
  background-color: ${p => p.state};

  &:hover {
    cursor: pointer;
    filter: brightness(70%);
  }

  &::marker {
    content: '';
  }
`
