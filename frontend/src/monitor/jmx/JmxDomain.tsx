import React, { useCallback, useMemo, useReducer, useRef } from 'react'
import { Redirect, Route, Switch, useHistory, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import styled from 'styled-components'
import { FlexBox } from '../../components/FlexBox'
import useOutsideClickEvent from '../../utils/useOutsideClickEvent'
import { JmxDomainDTO, JmxDomainProp } from './Jmx'
import { JmxDomainAttr } from './JmxDomainAttr'
import { JmxDomainOp } from './JmxDomainOp'

export function JmxDomain(props: JmxDomainDTO) {
  const [columnMaxWidth, setColumnMaxWidth] = useReducer((oldState: { [key: string]: number }, { key, value }) => {
    if (value && (!oldState[key] || value > oldState[key])) {
      return { ...oldState, ...{ [key]: value } }
    }
    return oldState
  }, {})

  const rows = useMemo(
    () =>
      Object.keys(props)
        .map(row => props[row])
        .sort((a, b) => (a.props.length > b.props.length ? 1 : -1)),
    [props]
  )

  return (
    <Table style={{ textAlign: 'left' }}>
      {rows.map(row => (
        <TableRow key={row.namePath} jmxProp={row}>
          {row.props.map(attr => (
            <TableColumn key={attr[0]} attr={attr} setColumnMaxWidth={setColumnMaxWidth} width={columnMaxWidth[attr[0]]} />
          ))}
        </TableRow>
      ))}
    </Table>
  )
}

function TableRow({ jmxProp, children }: { jmxProp: JmxDomainProp; children }) {
  const { path, url } = useRouteMatch()
  const rowRef = useRef(null)
  const history = useHistory()

  return (
    <li ref={rowRef}>
      <FlexBox
        onClick={e => {
          history.push(`${url}/${jmxProp.namePath}`)
        }}
        justifyContent='flex-start'>
        {children}
      </FlexBox>
      <Route path={`${path}/${jmxProp.namePath}`}>
        <TableRowInfo jmxProp={jmxProp} rowRef={rowRef} />
      </Route>
    </li>
  )
}

function TableRowInfo({ jmxProp, rowRef }: { jmxProp: JmxDomainProp; rowRef }) {
  const { path, url } = useRouteMatch()
  const history = useHistory()
  const outsideClick = useCallback(
    () => history.push(url.slice(0, url.indexOf(jmxProp.namePath) - 1)),
    [history, jmxProp.namePath, url]
  )
  useOutsideClickEvent(rowRef, outsideClick)

  return (
    <>
      <FlexBox>
        {jmxProp.attr && <NavTabStyled to={`${url}/attr`}>Attributes</NavTabStyled>}
        {jmxProp.op && <NavTabStyled to={`${url}/op`}>Operations</NavTabStyled>}
      </FlexBox>
      <Switch>
        <Redirect exact from={path} to={`${path}/${jmxProp.attr ? 'attr' : 'op'}`} />
        <Route path={`${path}/attr`}>
          <JmxDomainAttr {...jmxProp} />
        </Route>
        <Route path={`${path}/op`}>
          <JmxDomainOp {...jmxProp} />
        </Route>
      </Switch>
    </>
  )
}

function TableColumn({ attr, setColumnMaxWidth, width }) {
  const key = attr[0]

  const div = useCallback(
    node => setColumnMaxWidth({ key, value: node?.getBoundingClientRect()?.width }),
    [key, setColumnMaxWidth]
  )

  return (
    <div ref={div} style={{ width: `${width}px` }}>
      {attr.map(v => (
        <div key={v}>{v}</div>
      ))}
    </div>
  )
}

const Table = styled.ol`
  font-size: 15px;
  width: 100%;
`
const NavTabStyled = styled(NavTab)`
  color: var(--primaryColor);
  text-decoration: none;
  font-size: 20px;
  position: relative;
  bottom: -2px;
  padding: 6px 12px;
  background-color: transparent;

  &.active {
    border: 2px solid var(--primaryColor);
    border-radius: 5px 5px 0 0;
    border-bottom: none;
    background: var(--backgroundColor);
  }
`
