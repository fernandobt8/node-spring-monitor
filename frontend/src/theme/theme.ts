import { createGlobalStyle, DefaultTheme } from 'styled-components'
import normalize from 'styled-normalize'
import { colors } from './colors'

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
}

export const darkTheme: DefaultTheme = {
  primaryColor: colors.primary,
  secondaryColor: colors.secondary,
  backgroundColor: colors.background,
}

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
  }

  * {
    background-color: inherit;
    margin: 0px;
    padding: 0px;
  }
`
