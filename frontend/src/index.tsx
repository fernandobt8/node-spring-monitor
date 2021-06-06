import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import App from './App'
import { darkTheme } from './theme'

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0px;
  }

  * {
    background-color: inherit;
  }
`

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <GlobalStyle />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
