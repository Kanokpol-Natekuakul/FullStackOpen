const mongoose = require('mongoose')
const app = require('./app')
const config = require('./utils/config')

if (!config.MONGODB_URI) {
  console.error('Set MONGODB_URI or MONGODB_URI_TEMPLATE in the environment before starting the server')
  process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI, { dbName: config.DB_NAME })
  .then(() => {
    console.log('Connected to MongoDB')

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`)
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  })
