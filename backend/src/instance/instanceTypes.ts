export enum InstanceStatus {
  CONNECTED = 'CONNECTED',
  DOWN = 'DOWN',
}

export type InstanceDTO = {
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
