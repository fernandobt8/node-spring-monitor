import { Document, Model, model, Schema } from 'mongoose'
import crypto from 'crypto'

const hash = (id: string) => crypto.createHmac('md5', 'abc').update(id).digest('hex')

export type InstanceStatus = 'CONNECTED' | 'DOWN'

const InstanceSchema = new Schema<InstanceDocument, InstanceModel>({
  remoteId: { type: String, index: true, unique: true },
  name: { type: String, required: true },
  managementUrl: { type: String, required: true },
  healthUrl: { type: String, required: true },
  serviceUrl: { type: String, required: true },
  metadata: {
    username: { type: String, required: true },
    userpassword: { type: String, required: true },
    startup: String,
    tags: {
      environment: String,
    },
  },
  status: { type: String, enum: ['CONNECTED', 'DOWN'], required: true, index: true },
  version: String,
  sessions: Number,
  uptime: Number,
})

export interface InstanceDTO {
  remoteId: string
  name: string
  managementUrl: string
  healthUrl: string
  serviceUrl: string
  metadata: {
    username: string
    userpassword: string
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

export interface InstanceDocument extends InstanceDTO, Document {}

export interface InstanceModel extends Model<InstanceDocument> {
  findByRemoteId(healthUrl: string): Promise<InstanceDocument>
}

InstanceSchema.statics.findByRemoteId = async function (this: Model<InstanceDocument>, healthUrl: string) {
  return this.findOne({ remoteId: hash(healthUrl) })
}

InstanceSchema.pre<InstanceDocument>('save', async function () {
  this.remoteId = hash(this.healthUrl)
})

export default model<InstanceDocument, InstanceModel>('instances', InstanceSchema)
