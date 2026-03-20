const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const { connectToDatabase, Person } = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('post-data', request => {
  if (request.method !== 'POST') {
    return ''
  }

  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.get('/api/persons', async (_request, response, next) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (_request, response, next) => {
  try {
    const count = await Person.countDocuments({})
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)

    if (!person) {
      return response.status(404).end()
    }

    return response.json(person)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({
      error: 'name is missing',
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number is missing',
    })
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { returnDocument: 'after', runValidators: true, context: 'query' }
    )

    if (!updatedPerson) {
      return response.status(404).end()
    }

    return response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({
      error: 'name is missing',
    })
  }

  if (!number) {
    return response.status(400).json({
      error: 'number is missing',
    })
  }

  try {
    const existingPerson = await Person.findOne({ name })

    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique',
      })
    }

    const person = new Person({
      name,
      number,
    })

    const savedPerson = await person.save()
    return response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB')

    app.listen(config.PORT, () => {
      console.log(`Phonebook backend running on port ${config.PORT}`)
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
  })
