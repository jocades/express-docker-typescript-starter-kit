import request from 'supertest'
import app from '../../../src/app'
import db from '../../../src/app/db'
// import User from '../../../src/models/user'

describe('auth middleware', () => {
  beforeEach(async () => {
    await db.connect()
  })

  afterEach(async () => {
    await db.close()
  })

  let token: string

  const exec = () =>
    request(app).get('/api/users/me').set('Authorization', token)

  it('should return 401 if no token is provided', async () => {
    token = ''
    const res = await exec()

    expect(res.status).toBe(401)
  })

  it('should return 401 if token is invalid', async () => {
    token = 'x'
    const res = await exec()

    expect(res.status).toBe(401)
  })

  // it('should return 200 if token is valid', async () => {
  //   token = new User().genAToken()
  //   const res = await exec()

  //   console.log(token)

  //   console.log(res.body)

  //   expect(res.status).toBe(200)
  // })
})
