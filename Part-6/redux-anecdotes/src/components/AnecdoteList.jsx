import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteItem = ({ a, onVote }) => (
  <div className="anecdote">
    <div className="content">{a.content}</div>
    <div className="meta">
      <span>has {a.votes} votes</span>
      <button onClick={() => onVote(a.id)}>vote</button>
    </div>
  </div>
)

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => dispatch(voteAnecdote(id))

  const sorted = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div className="list">
      {sorted.map(a => (
        <AnecdoteItem key={a.id} a={a} onVote={vote} />
      ))}
    </div>
  )
}

export default AnecdoteList
