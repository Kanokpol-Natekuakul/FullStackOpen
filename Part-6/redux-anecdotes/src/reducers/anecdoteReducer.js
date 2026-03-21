import { createSlice } from '@reduxjs/toolkit'

// start with empty state; we'll load anecdotes from the backend on app start
const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    updateAnecdote(state, action) {
      const updated = action.payload
      const idx = state.findIndex(a => a.id === updated.id)
      if (idx !== -1) {
        state[idx] = updated
        state.sort((a, b) => b.votes - a.votes)
      }
    },
      appendAnecdote(state, action) {
        const anecdote = action.payload
        state.push(anecdote)
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

export const { updateAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const response = await fetch('http://localhost:3001/anecdotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, votes: 0 })
    })
    const data = await response.json()
    dispatch(appendAnecdote(data))
  }
}

export const fetchAnecdotes = () => {
  return async (dispatch) => {
    try {
      const res = await fetch('http://localhost:3001/anecdotes')
      const data = await res.json()
      dispatch(setAnecdotes(data))
    } catch (e) {
      console.error('fetchAnecdotes failed', e)
    }
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch) => {
    try {
      const res = await fetch(`http://localhost:3001/anecdotes/${id}`)
      const anecdote = await res.json()
      const updated = { ...anecdote, votes: anecdote.votes + 1 }
      const putRes = await fetch(`http://localhost:3001/anecdotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })
      const data = await putRes.json()
      dispatch(updateAnecdote(data))
    } catch (e) {
      console.error('voteAnecdote failed', e)
    }
  }
}

export default anecdoteSlice.reducer
