import { Schema, model, Types, Model } from 'mongoose'
const { ObjectId } = Schema.Types
import Joi from 'joi'

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

// string insted of Types.ObjectId for ease of use in route handlers
interface IGroupMethods {
  addMember: (userId: string) => Promise<void>
  removeMember: (userId: string) => Promise<void>
}

type GroupDoc = Model<IGroup, {}, IGroupMethods>

const groupSchema = new Schema<IGroup, GroupDoc, IGroupMethods>(
  {
    name: { type: String, required: true },
    desc: { type: String, maxlength: 255 },
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

export const validate = (group: IGroup) => {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    desc: Joi.string().max(255),
    type: Joi.number().min(0).max(1),
  })

  return schema.validate(group)
}
