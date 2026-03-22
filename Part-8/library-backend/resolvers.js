import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import jwt from 'jsonwebtoken'
import Author from './models/Author.js'
import Book from './models/Book.js'
import User from './models/User.js'

const pubsub = new PubSub()
const BOOK_ADDED = 'BOOK_ADDED'

const HARDCODED_PASSWORD = 'secret'

const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}
      if (args.genre) filter.genres = { $in: [args.genre] }
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        filter.author = author._id
      }
      return Book.find(filter).populate('author')
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: async (author) =>
      Book.countDocuments({ author: author._id }),
  },
  Mutation: {
    createUser: async (root, args) => {
      try {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        return user.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', error }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== HARDCODED_PASSWORD) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_SECRET
      )
      return { value: token }
    },
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }
        const book = new Book({ ...args, author: author._id })
        await book.save()
        const populated = await book.populate('author')
        pubsub.publish(BOOK_ADDED, { bookAdded: populated })
        return populated
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', error }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        })
      }
      try {
        const author = await Author.findOne({ name: args.name })
        if (!author) return null
        author.born = args.setBornTo
        return author.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'BAD_USER_INPUT', error }
        })
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator([BOOK_ADDED])
    }
  },
}

export default resolvers
