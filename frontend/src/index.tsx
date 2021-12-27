import './utils/extensions'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GlobalStyle } from './theme/theme'
import Modal from 'react-modal'
import { AuthProvider } from './login/AuthContext'

Modal.setAppElement('#root')

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
