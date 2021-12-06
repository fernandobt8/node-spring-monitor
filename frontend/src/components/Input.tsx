import React from 'react'
import styled from 'styled-components'
import { BorderRadius } from '../theme/styles'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string
}

export function Input(props: InputProps) {
  return <InputStyle {...props} />
}

const InputStyle = styled.input<InputProps>`
  ${BorderRadius}
  color: var(--primaryColor);
  min-height: 20px;
  padding: 5px;
  ${p => p.width && `width: ${p.width};`}

  :focus-visible {
    outline: none;
    box-shadow: 0 0 2px 2px var(--blueColor);
  }
`
