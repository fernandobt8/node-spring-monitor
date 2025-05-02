import express, { NextFunction, Request, Response } from 'express'
import InstancesService from './instance/instances'
import { requiresAuth } from 'express-openid-connect'

const authGoogle = requiresAuth()

const springToken = 'Basic ' + Buffer.from(process.env.CLIENT_USER_SECRET).toString('base64')

function authSpring(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization
  if (springToken === auth) {
    next()
  } else {
    res.sendStatus(401)
  }
}

const routes = express.Router()
const routerApi = express.Router()
routes.use('/api', routerApi)

const instances = new InstancesService()

routes.post('/instances', authSpring, instances.create)
routes.delete('/instances/:id', authSpring, instances.delete)

routerApi.post('/instances', authGoogle, instances.list)
routerApi.get('/instances/aggregate', authGoogle, instances.aggregate)
routerApi.get('/instances/:id', authGoogle, instances.get)
routerApi.delete('/instances/:id', authGoogle, instances.delete)

routerApi.get('/redirect/instances/:id', authGoogle, instances.redirectGet)
routerApi.post('/redirect/instances/:id', authGoogle, instances.redirectPost)

routerApi.get('/user', authGoogle, (req: Request, res: Response) => {
  res.status(200).json(req.oidc.user)
})

export default routes
