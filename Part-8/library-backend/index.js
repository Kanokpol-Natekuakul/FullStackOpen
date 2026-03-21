import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import 'dotenv/config'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.error('error connecting to MongoDB:', err))

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
console.log(`Server ready at ${url}`)
