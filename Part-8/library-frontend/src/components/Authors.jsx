import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = () => {
  const { loading, data } = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (loading) return <div>loading...</div>

  const handleSubmit = (e) => {
    e.preventDefault()
    editAuthor({ variables: { name, setBornTo: Number(born) } })
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {data.allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <select value={name} onChange={e => setName(e.target.value)}>
            <option value="">-- select author --</option>
            {data.allAuthors.map(a => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>born <input type="number" value={born} onChange={e => setBorn(e.target.value)} /></div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
