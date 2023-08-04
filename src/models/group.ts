import { Schema, model, Types, Model } from 'mongoose'
const { ObjectId } = Schema.Types
import Joi from 'joi'
import { z } from 'zod'

// Not recommended to extend from the mongoose Document interface
// https://mongoosejs.com/docs/typescript/statics-and-methods.html

export interface IGroup extends BaseModel {
  name: string
  description: string
  privacy: 'public' | 'private'
  members: Types.ObjectId[]
  location: { type: 'Point'; coordinates: [number, number] }
}

interface IGroupMethods {
  addMember: (userId: string) => Promise<string>
  removeMember: (userId: string) => Promise<string>
}

type GroupDoc = Model<IGroup, {}, IGroupMethods>

const groupSchema = new Schema<IGroup, GroupDoc, IGroupMethods>(
  {
    name: { type: String, required: true },
    description: String,
    privacy: { type: String, enum: ['public', 'private'], default: 'public' },
    members: [{ type: ObjectId, ref: 'User' }],
    location: {
      type: { type: String, enum: ['Point'] },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true }
)

// https://docs.mongodb.com/manual/geospatial-queries/
groupSchema.index({ location: '2dsphere' })

groupSchema.methods.addMember = async function (userId) {
  if (this.members.includes(userId)) return 'Already a member'
  this.members.push(userId)
  await this.save()
  return `Joined group ${this.name}`
}

groupSchema.methods.removeMember = async function (userId) {
  if (!this.members.includes(userId)) return 'Not a member'
  this.members.pull(userId)
  await this.save()
  return `Left group ${this.name}`
}

export default model<IGroup, GroupDoc>('Group', groupSchema)

export const groupBody = z.object({
  name: z.string().max(255),
  description: z.string().max(255),
  privacy: z.enum(['public', 'private']),
  location: z.array(z.number()).length(2).optional(),
})
