import { Types } from 'mongoose'
import { auth } from '../../../src/middleware'
import User from '../../../src/models/user.model'

describe('auth middleware', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: new Types.ObjectId().toHexString(),
      isAdmin: true,
    }
    const token = new User(user).genAToken()
    const req = { header: jest.fn().mockReturnValue(token) }
    const res = {}
    const next = jest.fn()

    // @ts-ignore
    auth(req, res, next)
    // @ts-ignore
    expect(req.user).toMatchObject(user)
  })
})
