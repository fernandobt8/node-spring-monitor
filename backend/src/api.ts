import axios from 'axios'
import https from 'https'

export const api = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})
