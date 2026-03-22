import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState(null)
  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
    fetchPolicy: 'cache-and-network'
  })

  if (allBooksResult.loading) return <div>loading...</div>

  const allBooks = allBooksResult.data?.allBooks || []
  const genres = [...new Set(allBooks.flatMap(b => b.genres))]
  const books = selectedGenre
    ? (filteredResult.data?.allBooks || [])
    : allBooks

  const selectGenre = (genre) => {
    setSelectedGenre(genre)
    if (genre) filteredResult.refetch({ genre })
  }

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && <p>in genre <strong>{selectedGenre}</strong></p>}
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => selectGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
