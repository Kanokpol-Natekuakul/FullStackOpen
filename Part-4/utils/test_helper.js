const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const seedBlogs = async () => {
  const user = await User.findOne({})

  if (!user) {
    throw new Error('Cannot seed blogs without at least one user')
  }

  await Blog.deleteMany({})

  const savedBlogs = await Blog.insertMany(
    initialBlogs.map(blog => ({
      ...blog,
      user: user._id,
    }))
  )

  user.blogs = savedBlogs.map(blog => blog._id)
  await user.save()

  return savedBlogs
}

module.exports = {
  initialBlogs,
  blogsInDb,
  seedBlogs,
}
