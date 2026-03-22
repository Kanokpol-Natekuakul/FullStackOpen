import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import express from 'express'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import typeDefs from './schema.js'
import resolvers from './resolvers.js'
import User from './models/User.js'

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.error('error connecting to MongoDB:', err))

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = http.createServer(app)

const wsServer = new WebSocketServer({ server: httpServer, path: '/' })
const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})

await server.start()

const getUser = async (req) => {
  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.substring(7)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      return await User.findById(decoded.id)
    } catch {}
  }
  return null
}

app.use('/', cors(), express.json(), expressMiddleware(server, {
  context: async ({ req }) => ({ currentUser: await getUser(req) })
}))

httpServer.listen(4000, () => console.log('Server ready at http://localhost:4000'))
