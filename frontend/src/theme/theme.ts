import { createGlobalStyle } from 'styled-components'
import normalize from 'styled-normalize'
import { colors } from './colors'

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  body {
    --primaryColor: ${colors.primary};
    --secondaryColor: ${colors.secondary};
    --backgroundColor: ${colors.background};
    --blueColor: ${colors.blue};
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

export const queries = {
  tabletAndUp: 'min-width: 768px',
}
