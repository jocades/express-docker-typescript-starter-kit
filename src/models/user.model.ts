import { Schema, model, Model } from 'mongoose'
const { ObjectId } = Schema.Types
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { JWT_A_SECRET } from '../config/consts'

interface IUser extends MongoDocument {
  email: string
  password: string
  firstName: string
  lastName: string
  isAdmin: boolean
  auth: Hash[]
  provider: string
  providerId: string
  friends: string[]
}

interface IUserMethods {
  generateToken: () => string
}

export type UserDoc = IUser & Document

type UserModel = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, min: 5, max: 255, required: false },
    firstName: String,
    lastName: String,

    provider: String,
    providerId: String,

    isAdmin: { type: Boolean, default: false },
    friends: [{ type: ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true }
)

userSchema.methods = {
  generateToken: function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, JWT_A_SECRET)
  },
}

export default model<IUser, UserModel>('User', userSchema)

export const userBody = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(255),
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  isAdmin: z.boolean(),
})
