import { DefaultTheme } from 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
  }
}

export const darkTheme: DefaultTheme = {
  primaryColor: '#eee',
  secondaryColor: '#424242',
  backgroundColor: '#222',
}
