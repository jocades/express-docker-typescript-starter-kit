import { Schema, model, Types, Model } from 'mongoose'
const { ObjectId } = Schema.Types
import Joi from 'joi'

// Not recommended to extend from the mongoose Document interface
// https://mongoosejs.com/docs/typescript/statics-and-methods.html

enum GroupPrivacy {
  public,
  private,
}

interface IGroup extends BaseModel {
  name: string
  desc: string
  privacy: GroupPrivacy
  members: Types.ObjectId[]
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
    privacy: { type: Number, enum: [0, 1] },
    members: [{ type: ObjectId, ref: 'User' }],
    location: {
      lat: Number,
      long: Number,
    },
  },
  { timestamps: true }
)

const { methods } = groupSchema

methods.addMember = async function (userId) {
  this.members.push(userId)
  await this.save()
}

methods.removeMember = async function (userId) {
  this.members.pull(userId)
  await this.save()
}

export default model<IGroup, GroupDoc>('Group', groupSchema)

export const validateGroup = (group: IGroup) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    desc: Joi.string().max(255),
    privacy: Joi.number().min(0).max(1),
    location: Joi.string().max(255), // comes from the client in a stringified format
  })

  return schema.validate(group)
}
