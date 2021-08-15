import express from 'express'
import InstancesService from './instances'

const routes = express.Router()
const instances = new InstancesService()

routes.post('/instances', instances.create)

routes.get('/instances', instances.list)

routes.get('/instances/:id', instances.get)

routes.get('/redirect/instances/:id', instances.redirectGet)

routes.post('/redirect/instances/:id', instances.redirectPost)

export default routes
