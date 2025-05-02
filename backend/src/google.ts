import { auth } from 'express-openid-connect'
import { ProxyAgent } from 'proxy-agent'

const proxy = new ProxyAgent()

export const authGoogle = auth({
  issuerBaseURL: 'https://accounts.google.com',
  baseURL: process.env.BASE_URL,
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  secret: process.env.SESSION_SECRET!,
  httpAgent: {
    http: proxy,
    https: proxy,
  },
  authRequired: false,
  routes: {
    login: '/api/login',
    logout: '/api/logout',
    callback: '/api/google/callback',
  },
  authorizationParams: {
    scope: 'openid email profile',
    response_type: 'code',
  },
})
