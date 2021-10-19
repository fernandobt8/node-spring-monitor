import axios from 'axios'
import crypto from 'crypto'
import { Request, Response } from 'express'
import { api } from '../api'
import { InstanceDTO, InstanceStatus } from './instanceTypes'

const instances: InstanceDTO[] = []

export default class InstancesService {
  async create(request: Request, response: Response) {
    let instance: InstanceDTO = request.body

    let id = crypto.createHash('md5').update(instance.healthUrl).digest('hex')

    const index = instances.findIndex((ins) => ins.id === id)
    if (index === -1) {
      instances.push({ ...instance, id: id, status: 'DOWN' })
    } else {
      instances[index] = { ...instances[index], ...instance }
    }

    response.status(200).json({ id: id })
  }

  async list(request: Request, response: Response) {
    response.status(200).send(instances)
  }

  async get(request: Request, response: Response) {
    let id = request.params.id
    let instance = instances.find((ins) => ins.id === id)

    response.send(instance)
  }

  async redirectGet(request: Request, response: Response) {
    let id = request.params.id
    let instance = instances.find((ins) => ins.id === id)

    if (!instance) {
      response.status(500).send()
      return
    }

    let path = request.query.path
    let headers = request.query.headers as string

    api
      .get(`${instance.managementUrl}/${path}`, {
        auth: {
          username: instance.metadata['user.name'],
          password: instance.metadata['user.password'],
        },
        headers: headers && JSON.parse(headers),
      })
      .then(({ data, headers }) => {
        response.send({ headers, body: data })
      })
      .catch((err) => {
        console.log(err)
        response.status(500).send()
      })
  }

  async redirectPost(request: Request, response: Response) {
    let id = request.params.id
    let instance = instances.find((ins) => ins.id === id)

    if (!instance) {
      response.status(500).send()
      return
    }

    let path = request.query.path
    let headers = request.query.headers as string

    api
      .post(`${instance.managementUrl}/${path}`, request.body, {
        auth: {
          username: instance.metadata['user.name'],
          password: instance.metadata['user.password'],
        },
        headers: headers && JSON.parse(headers),
      })
      .then(({ data }) => {
        response.send(data)
      })
      .catch((err) => {
        console.log(err.status)
        response.status(500).send()
      })
  }
}

const configMonitor = [
  { path: '/info', onlyConnected: false, field: 'version', value: (data) => data.build.version },
  { path: '/metrics/pec.sessions', onlyConnected: true, field: 'sessions', value: (data) => data?.measurements[0]?.value },
  { path: '/metrics/process.uptime', onlyConnected: true, field: 'uptime', value: (data) => data?.measurements[0]?.value },
]

setInterval(() => {
  configMonitor.forEach((config) =>
    instances
      .filter((i) => (config.onlyConnected ? i.status === 'CONNECTED' : true))
      .forEach((instance) =>
        api
          .get(`${instance.managementUrl}${config.path}`, {
            auth: {
              username: instance.metadata['user.name'],
              password: instance.metadata['user.password'],
            },
          })
          .then(({ data }) => {
            instance.status = 'CONNECTED'
            instance[config.field] = config.value(data)
          })
          .catch((err) => {
            instance.status = 'DOWN'
          })
      )
  )
}, 60 * 1000)
