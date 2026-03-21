import { createSlice } from '@reduxjs/toolkit'

// start with empty state; we'll load anecdotes from the backend on app start
const initialState = []

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
    ,
    setAnecdotes(state, action) {
      // replace state with anecdotes from backend; ensure sorted
      const arr = action.payload.slice()
      arr.sort((a, b) => b.votes - a.votes)
      return arr
    }
  }
})

export const { voteAnecdote, createAnecdote } = anecdoteSlice.actions
export const { setAnecdotes } = anecdoteSlice.actions

export default anecdoteSlice.reducer
