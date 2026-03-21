import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'
import { useShowNotification } from '../context/NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const showNotification = useShowNotification()

  const mutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`you created '${newAnecdote.content}'`, 5)
    }
  })

  const add = (e) => {
    e.preventDefault()
    const input = e.target.elements['anecdote']
    const value = input.value.trim()
    if (value.length < 5) return
    mutation.mutate(value)
    input.value = ''
  }

  return (
    <form onSubmit={add} className="add-form">
      <input name="anecdote" placeholder="new anecdote" />
      <button type="submit">add</button>
    </form>
  )
}

export default AnecdoteForm
