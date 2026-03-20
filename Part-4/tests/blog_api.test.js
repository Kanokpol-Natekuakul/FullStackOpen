process.env.NODE_ENV = 'test'

const { after, before, beforeEach, describe, test } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const config = require('../utils/config')
const helper = require('../utils/test_helper')
const userHelper = require('../utils/user_test_helper')

const api = supertest(app)

const loginAndGetToken = async (credentials = {
  username: userHelper.initialUsers[0].username,
  password: userHelper.initialUsers[0].password,
}) => {
  const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

  return response.body.token
}

before(async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(config.MONGODB_URI, { dbName: config.DB_NAME })
})

beforeEach(async () => {
  await userHelper.seedUsers()
  await helper.seedBlogs()
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

  test('blogs include creator user information', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.user)
    assert.strictEqual(blog.user.username, userHelper.initialUsers[0].username)
    assert.strictEqual(blog.user.name, userHelper.initialUsers[0].name)
    assert.ok(blog.user.id)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
      title: 'Async testing in Node',
      author: 'Codex',
      url: 'https://example.com/async-testing',
      likes: 14,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.ok(blogsAtEnd.map(blog => blog.title).includes(newBlog.title))
  })

  test('assigns a creator to the new blog', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
      title: 'Blog with creator',
      author: 'Codex',
      url: 'https://example.com/creator',
      likes: 10,
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.ok(response.body.user)
    assert.strictEqual(response.body.user.username, userHelper.initialUsers[0].username)
    assert.strictEqual(response.body.user.name, userHelper.initialUsers[0].name)
  })

  test('defaults likes to 0 if likes property is missing', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
      title: 'Blog without likes',
      author: 'Codex',
      url: 'https://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Codex',
      url: 'https://example.com/no-token',
      likes: 1,
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /token missing or invalid/i)
  })

  test('fails with status code 400 if title is missing', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
      author: 'Codex',
      url: 'https://example.com/missing-title',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 400 if url is missing', async () => {
    const token = await loginAndGetToken()
    const newBlog = {
      title: 'Missing URL blog',
      author: 'Codex',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if the creator deletes the blog', async () => {
    const token = await loginAndGetToken()
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    assert.ok(!blogsAtEnd.map(blog => blog.title).includes(blogToDelete.title))
  })

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /token missing or invalid/i)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('fails with status code 403 if a different user tries to delete the blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const anotherUser = {
      username: 'anotheruser',
      name: 'Another User',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(anotherUser)
      .expect(201)

    const token = await loginAndGetToken({
      username: anotherUser.username,
      password: anotherUser.password,
    })

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /application\/json/)

    assert.match(response.body.error, /only the creator can delete a blog/i)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    assert.ok(blogsAtEnd.map(blog => blog.title).includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds in updating the likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: 99,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 99)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlogInDb.likes, 99)
  })
})

after(async () => {
  await mongoose.connection.close()
})
