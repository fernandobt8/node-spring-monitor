import axios from 'axios'
import crypto from 'crypto'
import { Request, Response } from 'express'

enum InstanceStatus {
  CONNECTED = 'CONNECTED',
  DOWN = 'DOWN',
}

type InstanceDTO = {
  id: string
  name: string
  managementUrl: string
  healthUrl: string
  serviceUrl: string
  metadata: {
    'user.name': string
    'user.password': string
    startup: string
    tags: {
      environment: string
    }
  }
  status: InstanceStatus
  version: string
  sessions: number
  uptime: number
}

const instances: InstanceDTO[] = []

export default class InstancesService {
  async create(request: Request, response: Response) {
    let instance: InstanceDTO = request.body

    let id = crypto.createHash('md5').update(instance.healthUrl).digest('hex')

    const index = instances.findIndex((ins) => ins.id === id)
    if (index === -1) {
      instances.push({ ...instance, id: id, status: InstanceStatus.DOWN })
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
    let instance = instances.filter((ins) => ins.id === id)[0]

    response.send(instance)
  }

  async redirect(request: Request, response: Response) {
    let id = request.params.id
    let instance = instances.filter((ins) => ins.id === id)[0]

    let path = request.query.path

    axios
      .get(`${instance.managementUrl}/${path}`, {
        auth: {
          username: instance.metadata['user.name'],
          password: instance.metadata['user.password'],
        },
      })
      .then(({ data }) => {
        response.send(data)
      })
      .catch((err) => {
        console.log(err.status)
      })
  }
}

setInterval(() => {
  instances.forEach((instance) =>
    axios
      .get(`${instance.managementUrl}/info`, {
        auth: {
          username: instance.metadata['user.name'],
          password: instance.metadata['user.password'],
        },
      })
      .then(({ data }) => {
        instance.status = InstanceStatus.CONNECTED
        instance.version = data.build.version
      })
      .catch((err) => {
        instance.status = InstanceStatus.DOWN
      })
  )
}, 60 * 1000)

setInterval(() => {
  instances.forEach((instance) =>
    axios
      .get(`${instance.managementUrl}/metrics/pec.sessions`, {
        auth: {
          username: instance.metadata['user.name'],
          password: instance.metadata['user.password'],
        },
      })
      .then(({ data }) => {
        instance.sessions = data?.measurements[0]?.value
      })
      .catch((err) => {
        instance.status = InstanceStatus.DOWN
      })
  )
}, 60 * 1000)

setInterval(() => {
  instances.forEach((instance) =>
    axios
      .get(`${instance.managementUrl}/metrics/process.uptime`, {
        auth: {
          username: instance.metadata['user.name'],
          password: instance.metadata['user.password'],
        },
      })
      .then(({ data }) => {
        instance.uptime = data?.measurements[0]?.value
      })
      .catch((err) => {
        instance.status = InstanceStatus.DOWN
      })
  )
}, 60 * 1000)
