import express from 'express'
import cors from 'cors'
import routes from './routes'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import cookieSession from 'cookie-session'

const app = express()
const PORT = 8000

app.use(express.json())
// app.use(
//   cors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//   })
// )
app.use(cookieParser())

app.use(
  cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
  })
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/api', routes)

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
