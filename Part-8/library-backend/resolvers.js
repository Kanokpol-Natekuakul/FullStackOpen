import Author from './models/Author.js'
import Book from './models/Book.js'

const resolvers = {
  Query: {
    bookCount: () => Book.countDocuments(),
    authorCount: () => Author.countDocuments(),
    allBooks: async (root, args) => {
      // filtering by author/genre deferred to later exercises
      return Book.find({}).populate('author')
    },
    allAuthors: () => Author.find({}),
  },
  Author: {
    bookCount: async (author) =>
      Book.countDocuments({ author: author._id }),
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
        await author.save()
      }
      const book = new Book({ ...args, author: author._id })
      await book.save()
      return book.populate('author')
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      author.born = args.setBornTo
      return author.save()
    },
  },
}

export default resolvers
