const fs = require('fs')
const mongoose = require('mongoose')
const path = require('path')

const loadEnvFile = () => {
  const envPath = path.join(__dirname, '.env')

  if (!fs.existsSync(envPath)) {
    return
  }

  const envFile = fs.readFileSync(envPath, 'utf8')

  envFile.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return
    }

    const separatorIndex = trimmedLine.indexOf('=')

    if (separatorIndex === -1) {
      return
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim()

    if (!(key in process.env)) {
      process.env[key] = value
    }
  })
}

loadEnvFile()

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Usage:')
  console.log('  node mongo.js <password>')
  console.log('  node mongo.js <password> "Name Here" <number>')
  process.exit(1)
}

const password = process.argv[2]
const uriTemplate = process.env.MONGODB_URI_TEMPLATE

if (!uriTemplate) {
  console.log('Set MONGODB_URI_TEMPLATE in your environment before running mongo.js')
  process.exit(1)
}

const url = uriTemplate.includes('<PASSWORD>')
  ? uriTemplate.replace('<PASSWORD>', password)
  : uriTemplate

mongoose.set('strictQuery', false)
mongoose.connect(url, { dbName: 'phonebookApp' })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch(error => {
      console.error(error.message)
      mongoose.connection.close()
    })
} else {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch(error => {
      console.error(error.message)
      mongoose.connection.close()
    })
}
