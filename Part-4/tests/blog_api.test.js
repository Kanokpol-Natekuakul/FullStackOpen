process.env.NODE_ENV = 'test'

const { after, before, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const config = require('../utils/config')
const helper = require('../utils/test_helper')

const api = supertest(app)

before(async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(config.MONGODB_URI, { dbName: config.DB_NAME })
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('when there are some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    assert.ok(blogsAtStart[0].id)
  })
})

after(async () => {
  await mongoose.connection.close()
})
