import React from 'react'
import { useSelector } from 'react-redux'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateAnecdote } from '../services/anecdotes'
import { useShowNotification } from '../context/NotificationContext'

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
  const queryClient = useQueryClient()
  const showNotification = useShowNotification()

  const mutation = useMutation({
    mutationFn: (anecdote) => updateAnecdote({ ...anecdote, votes: anecdote.votes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const vote = (anecdote) => {
    mutation.mutate(anecdote)
    showNotification(`you voted '${anecdote.content}'`, 5)
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
