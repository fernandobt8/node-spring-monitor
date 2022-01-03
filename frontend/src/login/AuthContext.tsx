import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api, { backend } from '../api'

export type Logged = 'logged' | 'wait' | 'notLogged' | 'error'

type AuthContent = {
  user: any
  logged: Logged
}

const AuthContext = createContext<AuthContent>(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState()
  const [logged, setLogged] = useState<Logged>('wait')

  const unauthorized = useCallback(() => {
    setLogged(prev => (prev === 'wait' ? 'wait' : 'error'))
    setUser(null)
  }, [])

  useEffect(() => {
    const interceptorId = backend.interceptors.response.use(
      response => response,
      error => {
        if (401 === error.response.status) {
          unauthorized()
          return Promise.resolve({ data: null })
        } else {
          return Promise.reject(error)
        }
      }
    )
    return () => backend.interceptors.response.eject(interceptorId)
  }, [unauthorized])

  useEffect(() => {
    api
      .user()
      .then(({ data }) => {
        if (data) {
          setLogged('logged')
          setUser(data)
        } else {
          setUser(null)
          setLogged('logged')
        }
      })
      .catch(err => {
        setUser(null)
        setLogged('notLogged')
      })
  }, [])

  return <AuthContext.Provider value={{ user, logged }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
