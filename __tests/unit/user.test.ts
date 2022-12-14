import User from '../../src/models/user'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

const accessSecret = process.env.JWT_A_KEY as string
const refreshSecret = process.env.JWT_R_KEY as string

describe('user.generateAcessToken', () => {
  it('should return a valid access JWT', () => {
    const payload = { _id: new Types.ObjectId(), isAdmin: true }
    const user = new User(payload)
    const token = user.genAToken()
    const decoded = jwt.verify(token, accessSecret)

    expect(decoded).toMatchObject(payload)
  })
})

describe('user.generateRefreshToken', () => {
  it('should return a valid refresh JWT', () => {
    const payload = { _id: new Types.ObjectId() }
    const user = new User(payload)
    const token = user.genRToken()
    const decoded = jwt.verify(token, refreshSecret)

    expect(decoded).toMatchObject(payload)
  })
})
