import request from 'supertest'
import app from '../../../src/start/app'
import db from '../../../src/start/db'
import Group from '../../../src/models/group'
import { Types } from 'mongoose'

const endpoint = '/api/groups'
const groups = ['group1', 'group2', 'group3']

describe(endpoint, () => {
  beforeAll(async () => {
    await db.connect()
  })

  beforeEach(async () => {
    await Group.insertMany(groups.map((name) => ({ name })))
  })

  afterEach(async () => {
    await Group.deleteMany()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('GET /', () => {
    it('should return all groups', async () => {
      const res = await request(app).get(endpoint)

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(groups.length)
      expect(res.body.some((g: any) => g.name === 'group1')).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    it('should return a group if valid id is passed', async () => {
      const group = new Group({ name: 'group1' })
      await group.save()

      const res = await request(app).get(`${endpoint}/${group._id}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', group.name)
    })

    it('should return 404 if invalid id is given', async () => {
      const res = await request(app).get('/api/groups/1')

      expect(res.status).toBe(404)
    })

    it('should return 404 if no group with the given id exists', async () => {
      const id = new Types.ObjectId()
      const res = await request(app).get(`/api/groups/${id}`)

      expect(res.status).toBe(404)
    })
  })
})
