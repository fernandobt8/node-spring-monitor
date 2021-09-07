import styled from 'styled-components'

type LabelProps = {
  size?: string
  bold?: boolean
  padding?: string
  margin?: string
}

export const Label = styled.label<LabelProps>`
  ${p => p.size && `font-size: ${p.size};`}
  ${p => p.padding && `padding: ${p.padding};`}
  ${p => p.margin && `margin: ${p.margin};`}
  font-weight: ${p => (p.bold ? 'bold' : 'normal')};
`
