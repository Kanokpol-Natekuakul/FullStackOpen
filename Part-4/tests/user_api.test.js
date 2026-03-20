process.env.NODE_ENV = 'test'

const { after, before, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const config = require('../utils/config')
const helper = require('../utils/user_test_helper')
const blogHelper = require('../utils/test_helper')

const api = supertest(app)

before(async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(config.MONGODB_URI, { dbName: config.DB_NAME })
  await User.syncIndexes()
})

beforeEach(async () => {
  await helper.seedUsers()
  await blogHelper.seedBlogs()
})

describe('when there is initially one user in db', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returned users include the blogs they created', async () => {
    const response = await api.get('/api/users')
    const user = response.body[0]

    assert.ok(Array.isArray(user.blogs))
    assert.strictEqual(user.blogs.length, blogHelper.initialBlogs.length)
    assert.strictEqual(user.blogs[0].title, blogHelper.initialBlogs[0].title)
    assert.ok(user.blogs[0].id)
  })

  test('creation succeeds with a fresh username', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
    assert.ok(usersAtEnd.map(user => user.username).includes(newUser.username))
  })

  test('creation fails with status code 400 and proper message if username already exists', async () => {
    const newUser = {
      username: 'root',
      name: 'Another Root',
      password: 'salainen',
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /unique/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with status code 400 if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'salainen',
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /shorter than the minimum allowed length|at least 3/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with status code 400 if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: 'pw',
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /password must be at least 3 characters long/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with status code 400 if username is missing', async () => {
    const newUser = {
      name: 'Missing Username',
      password: 'salainen',
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username and password are required/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with status code 400 if password is missing', async () => {
    const newUser = {
      username: 'missingpassword',
      name: 'Missing Password',
    }

    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username and password are required/i)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
