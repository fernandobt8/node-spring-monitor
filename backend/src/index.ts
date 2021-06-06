import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()
const PORT = 8000

app.use(express.json())
app.use(cors())
app.use(routes)

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
