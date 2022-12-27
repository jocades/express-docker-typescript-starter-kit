import { Schema, model, Model } from 'mongoose'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { encrypt } from '../utils/hash'

// Types in types.d.ts
type UserDoc = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserDoc, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,

    isAdmin: { type: Boolean, default: false },
    auth: [{ type: String, default: [] }],
  },
  { timestamps: true }
)

const accessSecret = process.env.JWT_A_SECRET as string
const refreshSecret = process.env.JWT_R_SECRET as string

userSchema.methods.genAToken = function () {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, accessSecret, {
    expiresIn: '5m',
  })
}

userSchema.methods.genRToken = function () {
  const refreshToken = jwt.sign({ _id: this._id }, refreshSecret, {
    expiresIn: '30d',
  })
  return JSON.stringify(encrypt(refreshToken))
}

userSchema.methods.login = async function () {
  const user = this
  const access = user.genAToken()
  const refresh = user.genRToken()
  // token rotation
  if (user.auth.length >= 5) user.auth.shift()
  user.auth.push(refresh)
  await user.save()
  return { access, refresh }
}

userSchema.methods.logout = async function (rToken) {
  const user = this
  const i = user.auth.indexOf(rToken)
  if (i === -1) throw new Error('Invalid refresh token.')
  user.auth.splice(i, 1)
  await user.save()
  return `User ${user._id} logged out.`
}

// callback, just for fun
userSchema.methods.refresh = async function (rToken, cb) {
  const user = this
  const i = user.auth.indexOf(rToken)
  if (i === -1) return cb(new Error('Invalid refresh token.'))
  const access = user.genAToken()
  const refresh = user.genRToken()
  user.auth[i] = refresh
  await user.save()
  return cb(undefined, { access, refresh })
}

export default model<IUser, UserDoc>('User', userSchema)

export const validateUser = (email: string, password: string) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(),
  })

  return schema.validate({ email, password })
}
