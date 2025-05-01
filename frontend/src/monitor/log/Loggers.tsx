import React, { useEffect, useState, useMemo } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import api from '../../api'
import { Input } from '../../components/Input'
import { Label } from '../../components/Label'
import { FlexBox } from '../../components/FlexBox'

type LoggersDTO = {
  levels: string[]
  loggers: Record<
    string,
    { configuredLevel: string | null; effectiveLevel: string }
  >
}

const levelColors: Record<string,string> = {
    OFF:    '#6c757d',  // gray
    ERROR:  '#dc3545',  // red
    WARN:   '#ffc107',  // amber
    INFO:   '#17a2b8',  // teal
    DEBUG:  '#28a745',  // green
    TRACE:  '#6f42c1'   // purple
  }

export function Loggers() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<LoggersDTO | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    api.loggers.get(id, {}).then(({ data }) => setData(data))
  }, [id])

  const filteredEntries = useMemo(() => {
    if (!data) return []
    return Object.entries(data.loggers).filter(([name]) =>
      name.toLowerCase().includes(filter.toLowerCase())
    )
  }, [data, filter])

  const onChangeLevel = (loggerName: string, level: string) => {
    // POST /actuator/loggers/{loggerName}
    api.loggers.post(id, loggerName, { configuredLevel: level }).then(() => {
      // optimistic UI update
      setData(d => {
        if (!d) return d
        return {
          ...d,
          loggers: {
            ...d.loggers,
            [loggerName]: {
              configuredLevel: level,
              effectiveLevel: level || d.loggers[loggerName].effectiveLevel
            }
          }
        }
      })
    })
  }

  if (!data) return <div>Loading…</div>

  return (
    <Container>
      <FlexBox justifyContent='flex-start' gap={10} style={{ marginBottom: '1rem' }}>
        <Label>Filter:</Label>
        <Input
          width='400px'
          placeholder="e.g. com.example"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </FlexBox>

      <Table>
        <thead>
          <tr>
            <Th>Logger</Th>
            <Th>Effective</Th>
            <Th>Reset</Th>
            {data.levels.map(lvl => (
              <Th key={lvl}>{lvl}</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map(([name, info]) => (
            <Tr key={name}>
              <Td>{name}</Td>

              <EffectiveTd level={info.effectiveLevel}>
                {info.effectiveLevel}
              </EffectiveTd>

            <Td>
                <ResetButton
                    onClick={() => onChangeLevel(name, null)}
                    disabled={info.configuredLevel === null}>
                    ⟳
                </ResetButton>
            </Td>

              {data.levels.map(lvl => (
                <Td key={lvl}>
                  <LevelButton
                    level={lvl}
                    active={info.configuredLevel === lvl}
                    onClick={() => onChangeLevel(name, lvl)}
                  >
                    {lvl}
                  </LevelButton>
                </Td>
              ))}
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}


// styled-components

const Container = styled.div`
  text-align: left;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`
const Th = styled.th`
  padding: 0.5rem;
  border-bottom: 2px solid #ccc;
  text-align: left;
  font-family: monospace;
  font-size: 0.85rem;
`
const Tr = styled.tr``
const Td = styled.td`
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #eee;
  font-family: monospace;
  font-size: 0.85rem;

  &:first-child {
    word-break: break-word;
    text-align: left;
  }
`

// the level-button: colored border + fill when active
const LevelButton = styled.button<{ level: string; active: boolean }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border: 1px solid ${({ level }) => levelColors[level]};
  border-radius: 3px;
  background: ${({ level, active }) =>
    active ? levelColors[level] : 'transparent'};
  color: ${({ level, active }) =>
    active ? 'white' : levelColors[level]};
  cursor: pointer;

  &:hover {
    background: ${({ level }) => levelColors[level]};
    color: white;
  }
`

const ResetButton = styled.button.attrs<{disabled:boolean}>(p => ({
    disabled: p.disabled
  }))<{ disabled: boolean }>`
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    border: 1px dashed #999;
    background: transparent;
    color: #999;
    border-radius: 3px;
    cursor: pointer;
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  
    &:hover {
      background: #eee;
      color: #333;
    }
  `

// the “Effective” column—lightly tinted background based on level
const EffectiveTd = styled(Td)<{ level: string }>`
  background: ${({ level }) => `${levelColors[level]}33`}; /* 20% opacity */
  font-weight: bold;
`