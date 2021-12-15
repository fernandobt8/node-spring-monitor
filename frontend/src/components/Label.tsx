import styled from 'styled-components'

type LabelProps = {
  size?: string
  bold?: boolean
  padding?: string
  backgroundColor?: string
  margin?: string
  block?: boolean
  cursor?: string
}

export const Label = styled.label<LabelProps>`
  ${p => p.size && `font-size: ${p.size};`}
  ${p => p.backgroundColor && `background-color: ${p.backgroundColor};`}
  ${p => p.padding && `padding: ${p.padding};`}
  ${p => p.margin && `margin: ${p.margin};`}
  font-weight: ${p => (p.bold ? 'bold' : 'normal')};
  cursor: ${p => (p.cursor ? p.cursor : 'inherit')};
  ${p => p.block && `display: block;`}
`
