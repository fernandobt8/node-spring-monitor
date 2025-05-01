import crypto from 'crypto'

const hash = (id: string) => crypto.createHmac('md5', 'abc').update(id).digest('hex')

export type InstanceStatus = 'CONNECTED' | 'DOWN'

export interface InstanceDTO {
  id: string
  name: string
  managementUrl: string
  healthUrl: string
  serviceUrl: string
  metadata: {
    username: string
    userpassword: string
    startup: string
    environment: string
  }
  endpoints: Record<string, boolean>
  status: InstanceStatus
  environment: string
  uptime: number
}

const instances: InstanceDTO[] = []

function save(instance: InstanceDTO) {
  instance.id = instance.id || hash(instance.serviceUrl)

  const index = instances.findIndex((i) => i.id === instance.id)
  if (index !== -1) {
    instances[index] = { ...instances[index], ...instance }
    return instances[index]
  } else {
    instances.push(instance)
  }
  return instance
}

function findById(id: string) {
  return instances.find((instance) => instance.id === id)
}

function findByServiceUrl(serviceUrl: string) {
  return instances.find((instance) => instance.id === hash(serviceUrl))
}

function list() {
  return [...instances]
}

function deleteById(id: string) {
  const index = instances.findIndex((instance) => instance.id === id)
  if (index !== -1) {
    instances.splice(index, 1)
  }
}

export default {
  save,
  findById,
  findByServiceUrl,
  list,
  deleteById,
}
