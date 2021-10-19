import express, { NextFunction, Request, Response } from 'express'
import GoogleAuth from './google'
import InstancesService from './instances'

const routes = express.Router()
const routerApi = express.Router()
routes.use('/api', routerApi)

const instances = new InstancesService()

routes.post('/instances', instances.create)

routerApi.get('/instances', authenticateToken, instances.list)
routerApi.get('/instances/:id', authenticateToken, instances.get)

routerApi.get('/redirect/instances/:id', authenticateToken, instances.redirectGet)
routerApi.post('/redirect/instances/:id', authenticateToken, instances.redirectPost)

const google = new GoogleAuth()

routerApi.get('/user', authenticateToken, google.user)
routerApi.get('/auth', google.auth)
routerApi.get('/google/callback', google.callback)
routerApi.get('/logout', google.logout)

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export default routes
