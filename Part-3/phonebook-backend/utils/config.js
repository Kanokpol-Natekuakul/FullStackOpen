const fs = require('fs')
const path = require('path')

const loadEnvFile = () => {
  const envPath = path.join(__dirname, '..', '.env')

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

const PORT = process.env.PORT || 3001
const mongoUriTemplate = process.env.MONGODB_URI || process.env.MONGODB_URI_TEMPLATE

const getMongoUri = (password) => {
  if (!mongoUriTemplate) {
    return null
  }

  if (!mongoUriTemplate.includes('<PASSWORD>')) {
    return mongoUriTemplate
  }

  if (!password) {
    return null
  }

  return mongoUriTemplate.replace('<PASSWORD>', password)
}

module.exports = {
  PORT,
  getMongoUri,
}
