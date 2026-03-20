const express = require('express')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const app = express()

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

module.exports = app
