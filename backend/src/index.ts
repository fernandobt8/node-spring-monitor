require('dotenv').config()

import express from 'express'

import path from 'path'
import routes from './routes'
import { authGoogle } from './google'

const app = express()
const PORT = 8000

app.set('trust proxy', true)

app.use(express.json())

app.use(authGoogle)

app.use(routes)

app.use(express.static(path.join(__dirname, './static')))

app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, './static/index.html')))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
