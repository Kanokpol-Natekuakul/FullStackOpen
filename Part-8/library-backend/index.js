import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const authors = [
  { name: 'Robert Martin', born: 1952 },
  { name: 'Martin Fowler', born: 1963 },
  { name: 'Fyodor Dostoevsky', born: 1821 },
  { name: 'Joshua Kerievsky' },
  { name: 'Sandi Metz' },
]

const books = [
  { title: 'Clean Code', published: 2008, author: 'Robert Martin', genres: ['refactoring'] },
  { title: 'Agile software development', published: 2002, author: 'Robert Martin', genres: ['agile', 'patterns', 'design'] },
  { title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', genres: ['refactoring'] },
  { title: 'Refactoring to patterns', published: 2008, author: 'Joshua Kerievsky', genres: ['refactoring', 'patterns'] },
  { title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby', published: 2012, author: 'Sandi Metz', genres: ['refactoring', 'design'] },
  { title: 'Crime and punishment', published: 1866, author: 'Fyodor Dostoevsky', genres: ['classic', 'crime'] },
  { title: 'The Demon', published: 1872, author: 'Fyodor Dostoevsky', genres: ['classic', 'revolution'] },
]

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String): [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (args.author) return books.filter(b => b.author === args.author)
      return books
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (author) => books.filter(b => b.author === author.name).length,
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
console.log(`Server ready at ${url}`)
