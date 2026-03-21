const initialAnecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...'
]

const initialState = initialAnecdotes.map((content, i) => ({ id: i + 1, content, votes: 0 }))

const anecdoteReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'VOTE': {
    const id = action.payload
    return state.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
  }
  case 'ADD_ANECDOTE': {
    const content = action.payload
    const id = state.length ? Math.max(...state.map(a => a.id)) + 1 : 1
    return [...state, { id, content, votes: 0 }]
  }
  default:
    return state
  }
}

export default anecdoteReducer
