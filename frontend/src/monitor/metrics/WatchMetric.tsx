import React, { useMemo } from 'react'
import styled from 'styled-components'
import { BreakFlexLine } from '../../components/BreakFlexLine'
import { FlexBox } from '../../components/FlexBox'
import { Label } from '../../components/Label'
import { WatchMetricDto, WatchTagDto } from './Metrics'

type WatchMetricProps = {
  dto: WatchMetricDto
  remove: (name: string, tags: string[]) => void
}

const format = (wt: WatchTagDto) =>
  wt.baseUnit === 'bytes' && wt.value !== '-' ? `${(Number(wt.value) / (1024 * 1024)).toFixed(2)}MB` : wt.value

export function WatchMetric({ dto, remove }: WatchMetricProps) {
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const emptyTag = useMemo(() => dto.wTags.find(wt => wt.tags.length === 0), [dto.wTags.length])

  return (
    <Box>
      <FlexBox justifyContent='flex-start' gap={10} alignItems='stretch'>
        <Label onClick={() => remove(dto.name, [])} size='1.4rem' style={{ cursor: 'url("/cursor.cur"), auto' }}>
          {dto.name}
        </Label>
        <Label bold margin='auto 0px'>
          {emptyTag && format(emptyTag)}
        </Label>
        <BreakFlexLine />
        {dto.wTags
          .filter(wt => wt.tags.length > 0)
          .map((wt, index) => (
            <FlexBox
              key={index}
              gap={10}
              onClick={() => remove(dto.name, wt.tags)}
              style={{ cursor: 'url("/cursor.cur"), auto' }}>
              <div>
                {wt.tags.map(tag => (
                  <Label block key={tag}>
                    {tag}
                  </Label>
                ))}
              </div>
              <Label bold>{format(wt)}</Label>
              {index !== dto.wTags.length - (emptyTag ? 2 : 1) && <Barra />}
            </FlexBox>
          ))}
      </FlexBox>
    </Box>
  )
}

const Box = styled.li`
  box-shadow: 0 0 2px 2px var(--secondaryColor);
  padding: 15px;
  text-align: left;
  margin-bottom: 10px;
`

const Barra = styled.div`
  width: 2px;
  background-color: var(--primaryColor);
  align-self: stretch;
`
