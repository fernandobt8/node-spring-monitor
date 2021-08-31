import { createGlobalStyle } from 'styled-components'
import normalize from 'styled-normalize'
import { colors } from './colors'

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  #root {
    --primaryColor: ${colors.primary};
    --secondaryColor: ${colors.secondary};
    --backgroundColor: ${colors.background};
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0px;
    text-align: center;
    font-family: Sans-serif;
  }

  * {
    background-color: inherit;
    margin: 0px;
    padding: 0px;
  }

  li::marker {
    content: '';
  }
`
