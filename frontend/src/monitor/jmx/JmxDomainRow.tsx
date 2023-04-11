import React, { useCallback, useEffect, useRef, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router'
import { NavTab } from 'react-router-tabs'
import { Transition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import { FlexBox, FlexBoxProps } from '../../components/FlexBox'
import { colors } from '../../theme/colors'
import useHeight from '../../hooks/useHeight'
import useOutsideClickEvent from '../../hooks/useOutsideClickEvent'
import { JmxDomainProp } from './Jmx'
import { JmxDomainAttr } from './JmxDomainAttr'
import { JmxDomainOp } from './JmxDomainOp'

const transitionTime = 300

export function JmxDomainRow({ jmxProp, children }: { jmxProp: JmxDomainProp; children: any }) {
  const { path, url } = useRouteMatch()
  const location = useLocation()
  const rowRef = useRef(null)
  const history = useHistory()
  const beforeClick = useRef<() => void>(() => {})

  const selected = location.pathname.startsWith(`${url}/${jmxProp.namePath}/`)

  return (
    <Row ref={rowRef} selected={selected}>
      <RowHeader
        selected={selected}
        justifyContent='flex-start'
        onClick={e => {
          if (selected) {
            beforeClick.current()
            history.push(url)
          } else {
            history.push(`${url}/${jmxProp.namePath}/${jmxProp.attr ? 'attr' : 'op'}`)
          }
        }}>
        {children}
      </RowHeader>
      <TransitionGroup>
        <Transition key={selected + ''} in={selected} timeout={transitionTime + 100}>
          <Switch location={location}>
            <Route path={`${path}/${jmxProp.namePath}`}>
              <JmxDomainRowInfo beforeClick={beforeClick} jmxProp={jmxProp} rowRef={rowRef} />
            </Route>
          </Switch>
        </Transition>
      </TransitionGroup>
    </Row>
  )
}

function JmxDomainRowInfo({ beforeClick, jmxProp, rowRef }: { beforeClick; jmxProp: JmxDomainProp; rowRef: any }) {
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const [selected, setSelected] = useState(false)

  const outsideClick = useCallback(() => {
    setSelected(false)
    history.push(url.slice(0, url.indexOf(jmxProp.namePath) - 1))
  }, [history, jmxProp.namePath, url])
  useOutsideClickEvent(rowRef?.current, outsideClick)

  const [height, infoRef, updateHeight] = useHeight({ initialHeight: 'auto' })

  useEffect(() => {
    setSelected(true)
    beforeClick.current = () => setSelected(false)
  }, [beforeClick])

  return (
    <AnimateHeight duration={transitionTime} height={selected ? height : 1}>
      <div ref={infoRef}>
        <RowInfoHeader selected={selected} justifyContent='flex-start' gap={0}>
          {jmxProp.attr && <NavTabStyled to={`${url}/attr`}>Attributes</NavTabStyled>}
          {jmxProp.op && <NavTabStyled to={`${url}/op`}>Operations</NavTabStyled>}
        </RowInfoHeader>
        <Switch>
          <Route path={`${path}/attr`}>
            <JmxDomainAttr jmxProp={jmxProp} updateHeight={updateHeight} />
          </Route>
          <Route path={`${path}/op`}>
            <JmxDomainOp jmxProp={jmxProp} />
          </Route>
        </Switch>
      </div>
    </AnimateHeight>
  )
}

const Row = styled.li<{ selected: boolean }>`
  box-shadow: 0 0 2px 2px var(--secondaryColor);
  margin: ${p => (p.selected ? '2px' : '8px')};
  transition: all ${`${transitionTime}ms`};
`

interface RowHeaderProps extends FlexBoxProps {
  selected: boolean
}

const RowHeader = styled(FlexBox)<RowHeaderProps>`
  padding: 5px;
  background: ${p => (p.selected ? colors.secondary : colors.background)};
  transition: all ${`${transitionTime}ms`};

  &:hover {
    cursor: pointer;
  }
`
const RowInfoHeader = styled(RowHeader)<RowHeaderProps>`
  padding: 5px 5px 0px;
`

const NavTabStyled = styled(NavTab)`
  color: var(--primaryColor);
  text-decoration: none;
  padding: 6px 12px;

  &.active {
    background: var(--backgroundColor);
  }
`
