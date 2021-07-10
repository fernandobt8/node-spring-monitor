import React from 'react'
import styled from 'styled-components'
import { BorderRadius } from '../theme/styles'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <InputStyle {...props} />
}

const InputStyle = styled.input<React.InputHTMLAttributes<HTMLInputElement>>`
  ${BorderRadius}
  color: var(--primaryColor);
  min-height: 20px;
  padding: 5px;

  :focus-visible {
    outline: none;
    box-shadow: 0 0 2px 2px #50d0f6;
  }
`
