process.env.NODE_ENV = 'test'

const { after, before, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const helper = require('../utils/user_test_helper')

const api = supertest(app)

before(async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(config.MONGODB_URI, { dbName: config.DB_NAME })
})

beforeEach(async () => {
  await helper.seedUsers()
})

describe('when there is initially one user in db', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
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
})

after(async () => {
  await mongoose.connection.close()
})
