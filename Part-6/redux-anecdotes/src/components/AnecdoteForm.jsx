import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../services/anecdotes'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch(showNotification(`you created '${newAnecdote.content}'`, 5))
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
