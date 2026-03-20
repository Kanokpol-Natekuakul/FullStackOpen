const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(request.token, config.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    ...request.body,
    user: user._id,
  })

  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()

  await result.populate('user', {
    username: 1,
    name: 1,
  })

  return response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(request.token, config.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

  if (deletedBlog?.user) {
    const user = await User.findById(deletedBlog.user)

    if (user) {
      user.blogs = user.blogs.filter(blog => blog.toString() !== deletedBlog._id.toString())
      await user.save()
    }
  }

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { returnDocument: 'after', runValidators: true, context: 'query' }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter
