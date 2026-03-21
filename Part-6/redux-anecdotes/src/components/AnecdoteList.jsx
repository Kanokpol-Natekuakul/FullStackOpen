import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteItem = ({ a, onVote }) => (
  <div className="anecdote">
    <div className="content">{a.content}</div>
    <div className="meta">
      <span>has {a.votes} votes</span>
      <button onClick={() => onVote(a)}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5000))
  }

  const normalized = filter ? filter.toLowerCase() : ''
  const visible = anecdotes
    .filter(a => a.content.toLowerCase().includes(normalized))
    .slice()
    .sort((a, b) => b.votes - a.votes)

  return (
    <div className="list">
      {visible.map(a => (
        <AnecdoteItem key={a.id} a={a} onVote={vote} />
      ))}
    </div>
  )
}

export default AnecdoteList
