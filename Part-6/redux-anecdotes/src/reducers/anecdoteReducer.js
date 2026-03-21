import { createSlice } from '@reduxjs/toolkit'

const initialAnecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...'
]

const initialState = initialAnecdotes.map((content, i) => ({ id: i + 1, content, votes: 0 }))

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdote = state.find(a => a.id === id)
      if (anecdote) {
        anecdote.votes += 1
        state.sort((a, b) => b.votes - a.votes)
      }
    },
    createAnecdote(state, action) {
      const content = action.payload
      const id = state.length ? Math.max(...state.map(a => a.id)) + 1 : 1
      state.push({ id, content, votes: 0 })
      state.sort((a, b) => b.votes - a.votes)
    }
  }
})

export const { voteAnecdote, createAnecdote } = anecdoteSlice.actions

export default anecdoteSlice.reducer
