import styled from 'styled-components'

type LabelProps = {
  size?: string
  bold?: boolean
  padding?: string
}

export const Label = styled.label<LabelProps>`
  ${p => p.size && `font-size: ${p.size};`}
  ${p => p.padding && `padding: ${p.padding};`}
  font-weight: ${p => (p.bold ? 'bold' : 'normal')};
`
