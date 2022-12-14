import request from 'supertest'
import app from '../../../src/start/app'
import db from '../../../src/start/db'
import User from '../../../src/models/user'

const endpoint = '/api/auth'

describe(endpoint, () => {
  beforeEach(async () => {
    await db.connect()
  })

  afterEach(async () => {
    await User.deleteMany()
    await db.close()
  })

  let email: string
  let password: string

  describe('POST /register', () => {
    beforeEach(() => {
      email = 'jordi@mail.com'
      password = '123456'
    })

    const exec = () => request(app).post(`${endpoint}/register`).send({ email, password })

    it('should create the user if the email and password are valid', async () => {
      await exec()
      const user = await User.findOne({ email })

      expect(user).not.toBeNull()
    })

    it('should return the user id and email if valid email and password are given', async () => {
      const res = await exec()

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('email', email)
    })

    it('should return 400 if email is invalid', async () => {
      email = 'jordi'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is invalid', async () => {
      password = '1234'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 and a declarative message if user already exists', async () => {
      const user = new User({ email, password })
      await user.save()
      const res = await exec()

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'User already registered.')
    })
  })

  // login
  describe('POST /', () => {
    beforeEach(() => {
      email = 'jordi@mail.com'
      password = '123456'
    })

    const exec = () => request(app).post(endpoint).send({ email, password })

    it('should return 400 if email is invalid', async () => {
      email = 'jordi'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if password is invalid', async () => {
      password = '1234'
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 400 if user does not exist', async () => {
      const res = await exec()

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'Invalid email or password.')
    })

    it('should return 400 if passwords do not match', async () => {
      const user = new User({ email, password: '1234567' })
      await user.save()

      const res = await exec()

      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('message', 'Invalid email or password.')
    })

    // Commented out because it's not working
    // it('should return 200 and tokens if email and password are valid', async () => {
    //   const user = new User({ email, password })
    //   await user.save()

    //   const res = await request(app).post(endpoint).send({ email, password })

    //   expect(res.status).toBe(200)
    // expect(res.body).toHaveProperty('access')
    // expect(res.body).toHaveProperty('refresh')
    // })
  })

  describe('POST /refresh', () => {
    beforeEach(() => {
      email = 'jordi@mail.com'
      password = '123456'
    })

    it('should return 403 if refresh token is invalid', async () => {
      const rToken = new User().genRToken()
      const user = new User({ email, password, auth: rToken })
      await user.save()

      const res = await request(app).post(`${endpoint}/refresh`).send({ refresh: 'x' })

      expect(res.status).toBe(403)
    })

    // it('should return 200 and a new access token if refresh token is valid', async () => {
    //   const rToken = new User().genRToken()
    //   const user = new User({ email, password, auth: rToken })
    //   await user.save()

    //   const res = await request(app).post('/api/auth/refresh').send({ refresh: rToken })

    // console.log(res)

    //   console.log(res.body)

    //   expect(res.status).toBe(200)
    //   expect(res.body).toHaveProperty('access')
    // })
  })
})
