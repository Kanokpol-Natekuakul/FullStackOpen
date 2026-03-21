import React from 'react'
import { voteAnecdote } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import { useSelector, useDispatch } from 'react-redux'

function Anecdote({ a, onVote }) {
  return (
    <div className="anecdote">
      <div className="content">{a.content}</div>
      <div className="meta">
        <span>has {a.votes} votes</span>
        <button onClick={() => onVote(a.id)}>vote</button>
      </div>
    </div>
  )
}

function App() {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  const vote = (id) => dispatch(voteAnecdote(id))
  const add = (e) => {
    e.preventDefault()
    const form = e.target
    const value = form.elements['anecdote'].value.trim()
    if (!value) return
    dispatch(createAnecdote(value))
    form.elements['anecdote'].value = ''
  }


  return (
    <div className="container">
      <h1>Anecdotes</h1>

      <AnecdoteForm />

        <AnecdoteList />
    </div>
  )
}

export default App
