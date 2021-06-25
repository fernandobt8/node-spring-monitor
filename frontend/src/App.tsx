import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import styled from 'styled-components'
import InstancesList from './instances/InstancesList'
import InstanceMenu from './monitor/InstanceMenu'

function App() {
  return (
    <Container>
      <Switch>
        <Route path='/instances' component={InstancesList} exact />
        <Route path='/instances/:id' component={InstanceMenu} />
        <Redirect from='/' to='/instances' exact />
      </Switch>
    </Container>
  )
}

const Container = styled.div`
  background-color: var(--backgroundColor);
  color: var(--primaryColor);
  width: 100%;
  height: 100%;
`

export default App
