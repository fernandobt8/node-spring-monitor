import { Request, Response } from 'express'
import { api } from '../api'
import { ObjectId } from 'mongoose'
import Instance, { InstanceDTO, InstanceStatus } from './instanceSchema'

type InstanceQuery = {
  status: InstanceStatus
  application: string
  version: string
}

export default class InstancesService {
  async create(request: Request, response: Response) {
    let instanceR: InstanceDTO = request.body

    Instance.findByRemoteId(instanceR.healthUrl).then((value) => {
      const newValue = value || new Instance({ ...instanceR, status: 'DOWN' })
      newValue.metadata.username = instanceR.metadata['user.name']
      newValue.metadata.userpassword = instanceR.metadata['user.password']
      newValue.name = instanceR.name

      newValue
        .save()
        .then((value) => response.status(200).json({ id: value.remoteId }))
        .catch((error) => {
          console.log(error)

          response.sendStatus(500)
        })
    })
  }

  async list(request: Request, response: Response) {
    const filtro = Object.fromEntries(
      Object.entries(request.body?.filter)
        .filter(([_, v]) => v)
        .map(([k, v]) => [k, { $regex: `^${v}.*`, $options: 'si' }])
    )

    const requestOrder = request.body?.order

    const order = requestOrder?.fieldOrder.map((i) => (requestOrder[i] === -1 ? `-${i}` : i)).join(' ')

    Instance.find(filtro)
      .sort(order ? order : 'name status')
      .then((instances) => response.status(200).send(instances))
  }

  async get(request: Request, response: Response) {
    const id = request.params.id
    Instance.findById(id).then((value) => response.send(value))
  }

  async delete(request: Request, response: Response) {
    const id = request.params.id
    Instance.deleteOne({ _id: id }).then((value) => response.send(value))
  }

  async aggregate(request: Request, response: Response) {
    Instance.aggregate([
      {
        $group: {
          _id: null,
          applicationsSet: { $addToSet: '$name' },
          downs: { $sum: { $cond: [{ $eq: ['$status', 'DOWN'] }, 1, 0] } },
          instances: { $sum: 1 },
        },
      },
      {
        $addFields: { applications: { $size: '$applicationsSet' } },
      },
      {
        $unset: 'applicationsSet',
      },
    ]).then((value) => response.send(value[0]))
  }

  async redirectGet(request: Request, response: Response) {
    const id = request.params.id
    Instance.findById(id).then((instance) => {
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
          console.log(err)
          response.status(500).send()
        })
    })
  }

  async redirectPost(request: Request, response: Response) {
    const id = request.params.id
    Instance.findById(id).then((instance) => {
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
    Instance.find().then((instances) =>
      instances
        .filter((i) => (config.onlyConnected ? i.status === 'CONNECTED' : true))
        .forEach((instance) =>
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
              instance.save()
            })
            .catch((err) => {
              instance.status = 'DOWN'
            })
        )
    )
  )
}, 2 * 60 * 1000)
