import cookieSession from 'cookie-session'
import express from 'express'
import passport from 'passport'
import routes from './routes'

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

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
