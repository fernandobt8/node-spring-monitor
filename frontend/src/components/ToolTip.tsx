import React from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

export function ToolTip({ id, children }) {
  return (
    <ToolTipStyle place='top' effect='solid' type='dark' id={id}>
      {children}
    </ToolTipStyle>
  )
}

const ToolTipStyle = styled(ReactTooltip)`
  &&.show {
    opacity: 1;
    font-size: 16px;
    border-color: var(--primaryColor);
  }

  &&.place-top::before {
    border-top-color: var(--primaryColor);
  }

  &&.place-right::before {
    border-right-color: var(--primaryColor);
  }
`
