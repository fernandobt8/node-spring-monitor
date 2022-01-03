import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { FlexBox, FlexBoxProps } from './components/FlexBox'
import { Label } from './components/Label'
import InstancesList from './instances/InstancesListView'
import { useAuth } from './login/AuthContext'
import { Login } from './login/Login'
import { InstanceProvider } from './monitor/InstanceContext'
import InstanceMenu from './monitor/InstanceMenu'
import { colors } from './theme/colors'

function App() {
  const auth = useAuth()

  function view() {
    switch (auth.logged) {
      case 'logged':
        return (
          <>
            <Bar justifyContent='flex-end'>
              <Link to='/apps'>
                <Label bold>Applications</Label>
              </Link>
              <a href='/api/logout'>
                <Label bold>logout</Label>
              </a>
            </Bar>
            <Switch>
              <Route path='/apps' component={InstancesList} exact />
              <Route path='/apps/:id'>
                <InstanceProvider>
                  <InstanceMenu />
                </InstanceProvider>
              </Route>
              <Redirect from='/' to='/apps' exact />
            </Switch>
          </>
        )
      case 'notLogged':
        return <Login />
      case 'wait':
        return <div>carregando</div>
      case 'error':
        return <div>deu ruim</div>
    }
  }

  return <Container>{view()}</Container>
}

const Bar = styled(FlexBox)<FlexBoxProps>`
  padding: 10px;
  padding-right: calc(100vw - 90vw);
  margin: 0px 10px;
  border-bottom: 2px solid ${colors.primary};
  & > a {
    text-decoration: none;
    color: var(--primaryColor);
  }
`

const Container = styled.div`
  background-color: var(--backgroundColor);
  color: var(--primaryColor);
  min-width: 100%;
  min-height: 100%;
`

export default App
