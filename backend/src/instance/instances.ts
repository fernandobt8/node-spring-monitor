import { Request, Response } from 'express'
import { api } from '../api'
import repository, { InstanceDTO } from './instanceRepository'

export default class InstancesService {
  async create(request: Request, response: Response) {
    let instance: InstanceDTO = request.body
    instance.status = 'CONNECTED'
    instance.environment = instance.metadata.environment
    instance.endpoints = {}

    const value = repository.save(instance)

    api
      .get(instance.managementUrl, {
        auth: {
          username: instance.metadata.username,
          password: instance.metadata.userpassword,
        },
      })
      .then(({ data }) => {
        Object.entries(data._links).forEach(([key, value]) => {
          instance.endpoints[key] = !!value
        })

        repository.save(instance)
      })
      .catch((err) => {
        console.log(err)
        instance.status = 'DOWN'
      })

    response.status(200).json({ id: value.id })
  }

  async list(request: Request, response: Response) {
    const filter = request.body?.filter
    const order: Record<string, number> & { fieldOrder: string[] } = request.body?.order

    const instances = repository.list().filter((instance) => {
      if (filter?.status && instance.status !== filter.status) return false
      if (filter?.environment && instance.environment !== filter.environment) return false
      if (filter?.name && !instance.name.match(new RegExp(`^${filter.name}.*`, 'si'))) return false
      return true
    })

    if (order) {
      const { fieldOrder, ...dirs } = order

      instances.sort((a, b) => {
        for (const key of fieldOrder) {
          const dir = dirs[key]
          if (!dir) continue // skip keys with no ordering
          const cmp = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
          if (cmp !== 0) return cmp * dir // flip sign if dir === -1
        }
        return 0
      })
    }

    response.status(200).send(instances)
  }

  async get(request: Request, response: Response) {
    const id = request.params.id
    response.send(repository.findById(id))
  }

  async delete(request: Request, response: Response) {
    const id = request.params.id
    repository.deleteById(id)
    response.status(200).send()
  }

  async aggregate(request: Request, response: Response) {
    const applicationsSet = new Set()
    let downs = 0
    let instances = 0

    repository.list().forEach((instance) => {
      applicationsSet.add(instance.name)
      if (instance.status === 'DOWN') downs++
      instances++
    })

    response.send({ applications: applicationsSet.size, downs, instances })
  }

  async redirectGet(request: Request, response: Response) {
    const id = request.params.id
    const instance = repository.findById(id)
    if (!instance) {
      response.status(500).send()
      return
    }

    const path = request.query.path
    const headers = request.query.headers as string

    api
      .get(`${instance.managementUrl}/${path}`, {
        auth: {
          username: instance.metadata.username,
          password: instance.metadata.userpassword,
        },
        headers: headers && JSON.parse(headers),
      })
      .then(({ data, headers }) => {
        response.send({ headers, body: data })
      })
      .catch((err) => {
        console.log(err.response)
        response.status(500).send()
      })
  }

  async redirectPost(request: Request, response: Response) {
    const id = request.params.id
    const instance = repository.findById(id)
    if (!instance) {
      response.status(500).send()
      return
    }

    const path = request.query.path
    const headers = request.query.headers as string

    api
      .post(`${instance.managementUrl}/${path}`, request.body, {
        auth: {
          username: instance.metadata.username,
          password: instance.metadata.userpassword,
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
  { path: '/info', onlyConnected: false, field: 'version', value: (data) => data.build?.version },
  { path: '/metrics/process.uptime', onlyConnected: true, field: 'uptime', value: (data) => data?.measurements[0]?.value },
]

setInterval(() => {
  configMonitor.forEach((config) => {
    const instances = repository.list()

    instances
      .filter((i) => (config.onlyConnected ? i.status === 'CONNECTED' : true))
      .forEach((instance) => {
        api
          .get(`${instance.managementUrl}${config.path}`, {
            auth: {
              username: instance.metadata.username,
              password: instance.metadata.userpassword,
            },
          })
          .then(({ data }) => {
            instance.status = 'CONNECTED'
            instance[config.field] = config.value(data)
            repository.save(instance)
          })
          .catch((err) => {
            instance.status = 'DOWN'
            console.log(err)
          })
      })
  })
}, 2 * 60 * 1000)
