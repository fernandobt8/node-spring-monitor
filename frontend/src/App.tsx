import React, { useCallback, useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { api } from './api'
import { FlexBox, FlexBoxProps } from './components/FlexBox'
import { Label } from './components/Label'
import useAxiosAuthInterceptor from './hooks/useAxiosAuthInterceptor'
import InstancesList from './instances/InstancesList'
import { Login } from './login/Login'
import InstanceMenu from './monitor/InstanceMenu'
import { colors } from './theme/colors'

export type Logged = 'logged' | 'wait' | 'notLogged' | 'error'

function App() {
  const [logged, setLogged] = useState<Logged>('wait')

  const unauthorized = useCallback(() => setLogged(prev => (prev === 'wait' ? 'wait' : 'error')), [])
  useAxiosAuthInterceptor(unauthorized)

  useEffect(() => {
    api
      .get('/api/user')
      .then(({ data }) => {
        if (data) {
          setLogged('logged')
        } else {
          setLogged('notLogged')
        }
      })
      .catch(err => {
        setLogged('notLogged')
      })
  }, [])

  function view() {
    switch (logged) {
      case 'logged':
        return (
          <>
            <Bar justifyContent='flex-end'>
              <Link to='/instances'>
                <Label bold>Applications</Label>
              </Link>
              <a href='/api/logout'>
                <Label bold>logout</Label>
              </a>
            </Bar>
            <Switch>
              <Route path='/instances' component={InstancesList} exact />
              <Route path='/instances/:id' component={InstanceMenu} />
              <Redirect from='/' to='/instances' exact />
            </Switch>
          </>
        )
      case 'notLogged':
        return <Login setLogged={setLogged} />
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
  border-bottom: 2px solid ${colors.primary};
  & > a {
    text-decoration: none;
    color: var(--primaryColor);
  }
`

const Container = styled.div`
  background-color: var(--backgroundColor);
  color: var(--primaryColor);
  width: 100%;
  height: 100%;
`

export default App
