import { Schema, model, Model } from 'mongoose'
import jwt from 'jsonwebtoken'
import Joi from 'joi'

type UserDoc = Model<IUser, {}, IUserMethods>

const userSchema = new Schema<IUser, UserDoc, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    isAdmin: { type: Boolean, default: false },
    auth: { type: [String], default: [] },
  },
  { timestamps: true }
)

// methods in options object when defining new Schema do not have type support
const { methods } = userSchema
const accessSecret = process.env.JWT_A_KEY as string
const refreshSecret = process.env.JWT_A_KEY as string

methods.genAToken = function () {
  return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, accessSecret, {
    expiresIn: '1h',
  })
}

methods.genRToken = function () {
  return jwt.sign({ _id: this._id }, refreshSecret, {
    expiresIn: '7d',
  })
}

methods.login = async function () {
  const access = this.genAToken()
  const refresh = this.genRToken()
  if (this.auth.length >= 5) this.auth.shift()
  this.auth.push(refresh)
  await this.save()
  return { access, refresh }
}

methods.logout = async function (rToken) {
  const user = this
  const i = user.auth.indexOf(rToken)
  if (i === -1) throw new Error('Invalid refresh token.')
  user.auth.splice(i, 1)
  await user.save()
  return 'Logged out'
}

// callback, just for fun
methods.refresh = async function (rToken, cb) {
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

export const validate = (email: string, password: string) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(255).required(),
  })

  return schema.validate({ email, password })
}
