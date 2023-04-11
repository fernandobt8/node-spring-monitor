import React from 'react'
import styled from 'styled-components'
import { BorderRadius } from '../theme/styles'

export function Login() {
  return <LoginButton href='/api/auth'>Log in with Google</LoginButton>
}

const LoginButton = styled.a`
  ${BorderRadius}
  text-decoration: none;
  color: var(--primaryColor);
  display: inline-block;
  padding: 10px;
  margin-top: calc(100vh - 70vh);
`
