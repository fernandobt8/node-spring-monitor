import React, { useCallback } from 'react'
import GoogleLogin from 'react-google-login'
import { api } from '../api'
import { Logged } from '../App'

export function Login({ setLogged }: { setLogged: (e: Logged) => void }) {
  return <a href='/api/auth'>login</a>
}
