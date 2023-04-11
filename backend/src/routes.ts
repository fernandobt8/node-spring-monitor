import express, { NextFunction, Request, Response } from 'express'
import GoogleAuth from './google'
import InstancesService from './instance/instances'

const routes = express.Router()
const routerApi = express.Router()
routes.use('/api', routerApi)

const instances = new InstancesService()

routes.post('/instances', authPec, instances.create)

routerApi.post('/instances', authGoogle, instances.list)
routerApi.get('/instances/aggregate', authGoogle, instances.aggregate)
routerApi.get('/instances/:id', authGoogle, instances.get)
routerApi.delete('/instances/:id', authGoogle, instances.delete)

routerApi.get('/redirect/instances/:id', authGoogle, instances.redirectGet)
routerApi.post('/redirect/instances/:id', authGoogle, instances.redirectPost)

const google = new GoogleAuth()

routerApi.get('/user', authGoogle, google.user)
routerApi.get('/auth', google.auth)
routerApi.get('/google/callback', google.callback)
routerApi.get('/logout', google.logout)

function authGoogle(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401)
  }
}

const pecToken = 'Basic ' + Buffer.from(process.env.CLIENT_USER_SECRET).toString('base64')

function authPec(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (pecToken === auth) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export default routes
