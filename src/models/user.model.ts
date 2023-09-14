import { Schema, model, Model, InferSchemaType, Document } from 'mongoose'
const { ObjectId } = Schema.Types
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { JWT_A_SECRET } from '../config/consts'

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },

    provider: String,
    providerId: String,

    firstName: String,
    lastName: String,
    friends: [{ type: ObjectId, ref: 'User', default: [] }],
  },
  {
    timestamps: true,

    methods: {
      generateToken() {
        return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, JWT_A_SECRET)
      },
    },
  }
)

export const User = model('User', userSchema)

export const userBody = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(255),
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255),
  isAdmin: z.boolean(),
})
