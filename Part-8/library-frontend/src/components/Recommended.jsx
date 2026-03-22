import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommended = () => {
  const meResult = useQuery(ME)
  const genre = meResult.data?.me?.favoriteGenre
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre },
    skip: !genre
  })

  if (meResult.loading || booksResult.loading) return <div>loading...</div>

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{genre}</strong></p>
      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {(booksResult.data?.allBooks || []).map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
