import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const saved = localStorage.getItem('library-user-token')
    if (saved) setToken(saved)
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      setNotification(`New book added: "${addedBook.title}" by ${addedBook.author.name}`)
      setTimeout(() => setNotification(null), 5000)

      // Update ALL_BOOKS cache (no genre filter)
      client.cache.updateQuery({ query: ALL_BOOKS }, (existing) => {
        if (!existing) return existing
        const alreadyExists = existing.allBooks.some(b => b.title === addedBook.title)
        if (alreadyExists) return existing
        return { allBooks: existing.allBooks.concat(addedBook) }
      })
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.resetStore()
  }

  return (
    <div>
      {notification && <div style={{ border: '1px solid green', padding: 8, marginBottom: 8 }}>{notification}</div>}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {token
          ? <button onClick={logout}>logout</button>
          : <button onClick={() => setPage('login')}>login</button>
        }
      </div>
      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'add' && token && <NewBook />}
      {page === 'recommend' && token && <Recommended />}
      {page === 'login' && !token && <LoginForm setToken={(t) => { setToken(t); setPage('authors') }} />}
    </div>
  )
}

export default App
