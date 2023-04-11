import { css } from 'styled-components'
import { colors } from './colors'

export const BorderRadius = css<{ borderColor?: string }>`
  border: 2px solid ${props => props.borderColor || colors.primary};
  border-radius: 5px;
`
