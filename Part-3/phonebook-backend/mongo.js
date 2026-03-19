const mongoose = require('mongoose')
const { connectToDatabase, Person } = require('./models/person')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Usage:')
  console.log('  node mongo.js <password>')
  console.log('  node mongo.js <password> "Name Here" <number>')
  process.exit(1)
}

const password = process.argv[2]

connectToDatabase(password)
  .then(() => {
    if (process.argv.length === 3) {
      return Person.find({})
        .then(persons => {
          console.log('phonebook:')
          persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
        })
    }

    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name,
        number,
    })

    return person.save()
      .then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
      })
  })
  .catch(error => {
    console.error(error.message)
  })
  .finally(() => {
    mongoose.connection.close()
  })
