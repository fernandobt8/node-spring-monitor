import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import styled from 'styled-components'
import { api } from './api'
import InstancesList from './instances/InstancesList'
import { Login } from './login/Login'
import InstanceMenu from './monitor/InstanceMenu'

export type Logged = 'logged' | 'wait' | 'notLogged' | 'error'

function App() {
  const [logged, setLogged] = useState<Logged>('wait')

  useEffect(() => {
    api.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        if (401 === error.response.status) {
          setLogged(prev => (prev === 'wait' ? 'wait' : 'error'))
          return Promise.resolve({ data: null })
        } else {
          return Promise.reject(error)
        }
      }
    )
  }, [])

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

  let mainComponent
  switch (logged) {
    case 'logged':
      mainComponent = (
        <Switch>
          <Route path='/instances' component={InstancesList} exact />
          <Route path='/instances/:id' component={InstanceMenu} />
          <Redirect from='/' to='/instances' exact />
        </Switch>
      )
      break
    case 'notLogged':
      mainComponent = <Login setLogged={setLogged} />
      break
    case 'wait':
      mainComponent = <div>carregando</div>
      break
    case 'error':
      mainComponent = <div>deu ruim</div>
      break
  }

  return <Container>{mainComponent}</Container>
}

const Container = styled.div`
  background-color: var(--backgroundColor);
  color: var(--primaryColor);
  width: 100%;
  height: 100%;
`

export default App
