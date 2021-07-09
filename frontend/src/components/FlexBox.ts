import styled from 'styled-components'

export interface FlexBoxProps {
  justifyContent?: string
  alignItems?: string
  alignContent?: string
  flexDirection?: string
  gap?: number
  wrap?: string
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  flex-direction: ${p => p.flexDirection || 'row'};
  justify-content: ${p => p.justifyContent || 'center'};
  align-items: ${p => p.alignItems || 'center'};
  align-content: ${p => p.alignContent || 'normal'};
  flex-wrap: ${p => p.wrap || 'wrap'};
  gap: ${p => (p.gap !== undefined ? p.gap : 20)}px;
`
