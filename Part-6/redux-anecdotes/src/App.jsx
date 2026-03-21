import React from 'react'
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
  const vote = (id) => dispatch({ type: 'VOTE', payload: id })
  const add = (e) => {
    e.preventDefault()
    const form = e.target
    const value = form.elements['anecdote'].value.trim()
    if (!value) return
    dispatch({ type: 'ADD_ANECDOTE', payload: value })
    form.elements['anecdote'].value = ''
  }

  const sorted = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div className="container">
      <h1>Anecdotes</h1>

      <form onSubmit={add} className="add-form">
        <input name="anecdote" placeholder="new anecdote" />
        <button type="submit">add</button>
      </form>

      <div className="list">
        {sorted.map(a => (
          <Anecdote key={a.id} a={a} onVote={vote} />
        ))}
      </div>
    </div>
  )
}

export default App
