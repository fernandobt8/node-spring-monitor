import styled from 'styled-components'

export interface FlexBoxProps {
  justifyContent?: string
  alignItems?: string
  alignContent?: string
  gap?: number
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${p => p.justifyContent || 'center'};
  align-items: ${p => p.alignItems || 'center'};
  align-content: ${p => p.alignContent || 'normal'};
  flex-wrap: wrap;
  gap: ${p => (p.gap !== undefined ? p.gap : 20)}px;
`
