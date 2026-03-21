import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const add = (e) => {
    e.preventDefault()
    const form = e.target
    const value = form.elements['anecdote'].value.trim()
    if (!value) return
    dispatch(createAnecdote(value))
    form.elements['anecdote'].value = ''
  }

  return (
    <form onSubmit={add} className="add-form">
      <input name="anecdote" placeholder="new anecdote" />
      <button type="submit">add</button>
    </form>
  )
}

export default AnecdoteForm
