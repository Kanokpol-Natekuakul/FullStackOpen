const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (!request.body.title || !request.body.url) {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const user = request.user

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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user._id.toString()) {
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
  const userId = typeof request.body.user === 'object' && request.body.user !== null
    ? request.body.user.id || request.body.user._id
    : request.body.user

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    {
      ...request.body,
      user: userId,
    },
    { returnDocument: 'after', runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return response.status(404).end()
  }

  await updatedBlog.populate('user', {
    username: 1,
    name: 1,
  })

  response.json(updatedBlog)
})

module.exports = blogsRouter
