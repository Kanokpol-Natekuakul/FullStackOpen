import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import User from './models/User.js'

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.error('error connecting to MongoDB:', err))

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.substring(7)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id)
        return { currentUser }
      } catch {}
    }
    return {}
  }
})

console.log(`Server ready at ${url}`)
