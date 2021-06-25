import styled from 'styled-components'

export interface FlexBoxProps {
  justifyContent?: string
  alignItems?: string
  gap?: number
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${p => p.justifyContent || 'center'};
  align-items: ${p => p.alignItems || 'center'};
  flex-wrap: wrap;
  gap: ${p => p.gap || 20}px;
`
