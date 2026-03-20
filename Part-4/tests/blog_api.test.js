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

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Async testing in Node',
      author: 'Codex',
      url: 'https://example.com/async-testing',
      likes: 14,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.ok(blogsAtEnd.map(blog => blog.title).includes(newBlog.title))
  })

  test('defaults likes to 0 if likes property is missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Codex',
      url: 'https://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Codex',
      url: 'https://example.com/missing-title',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'Missing URL blog',
      author: 'Codex',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
