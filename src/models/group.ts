import { Schema, model, Types, Model } from 'mongoose'
const { ObjectId } = Schema.Types
import Joi from 'joi'

// Not recommended to extend from the mongoose Document interface
// https://mongoosejs.com/docs/typescript/statics-and-methods.html

export interface IGroup extends BaseModel {
  name: string
  desc: string
  privacy: 'public' | 'private'
  members: Types.ObjectId[]
  location: { type: 'Point'; coordinates: [number, number] }
}

interface IGroupMethods {
  addMember: (userId: string) => Promise<void>
  removeMember: (userId: string) => Promise<void>
}

type GroupDoc = Model<IGroup, {}, IGroupMethods>

const groupSchema = new Schema<IGroup, GroupDoc, IGroupMethods>(
  {
    name: { type: String, required: true },
    desc: String,
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
  this.members.push(userId)
  await this.save()
}

groupSchema.methods.removeMember = async function (userId) {
  this.members.pull(userId)
  await this.save()
}

export default model<IGroup, GroupDoc>('Group', groupSchema)

export const validateGroup = (group: IGroup) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    desc: Joi.string().max(255),
    privacy: Joi.string().valid('public', 'private'),
    location: Joi.array().items(Joi.number()).length(2),
  })

  return schema.validate(group)
}
