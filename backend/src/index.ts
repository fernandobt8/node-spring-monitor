import cookieSession from 'cookie-session'
import express from 'express'
import { connect } from 'mongoose'
import passport from 'passport'
import path from 'path'
import routes from './routes'

require('dotenv').config()

const app = express()
const PORT = 8000

app.use(express.json())

app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.use(express.static(path.join(__dirname, '../../frontend/build')))

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../frontend/build/index.html')))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})

const mongoHost = process.env.MONGO_HOST

connect(`mongodb://${mongoHost}/monitor`, { useNewUrlParser: true, useUnifiedTopology: true })
