const mongoose = require('mongoose')
const config = require('../utils/config')

mongoose.set('strictQuery', false)

const connectToDatabase = (password) => {
  const mongoUri = config.getMongoUri(password)

  if (!mongoUri) {
    throw new Error('Set a complete MongoDB URI before connecting to the database')
  }

  return mongoose.connect(mongoUri, { dbName: 'phonebookApp' })
}

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = {
  connectToDatabase,
  Person,
}
