require('dotenv').config()

const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URI_TEMPLATE
const DB_NAME = process.env.NODE_ENV === 'test'
  ? 'bloglistApp-test'
  : 'bloglistApp'

module.exports = {
  PORT,
  MONGODB_URI,
  DB_NAME,
}
