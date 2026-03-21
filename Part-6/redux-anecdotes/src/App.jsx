import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
// store initialization moved to store (thunk fetchAnecdotes)
import { useEffect } from 'react'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    fetch('http://localhost:3001/anecdotes')
      .then(res => res.json())
      .then(data => dispatch(setAnecdotes(data)))
      .catch(err => console.error('Failed to fetch anecdotes:', err))
  }, [dispatch])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
