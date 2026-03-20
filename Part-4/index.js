require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI || process.env.MONGODB_URI_TEMPLATE

if (!mongoUrl) {
  console.error('Set MONGODB_URI or MONGODB_URI_TEMPLATE in the environment before starting the server')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(mongoUrl, { dbName: 'bloglistApp' })
  .then(() => {
    console.log('Connected to MongoDB')

    const PORT = process.env.PORT || 3003
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })

app.use(express.json())

app.get('/api/blogs', (_request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then(result => {
    response.status(201).json(result)
  })
})
