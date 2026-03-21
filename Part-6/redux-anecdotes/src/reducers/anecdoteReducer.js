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
    const newState = state.map(a => a.id === id ? { ...a, votes: a.votes + 1 } : a)
    return [...newState].sort((x, y) => y.votes - x.votes)
  }
  case 'ADD_ANECDOTE': {
    const content = action.payload
    const id = state.length ? Math.max(...state.map(a => a.id)) + 1 : 1
    const newState = [...state, { id, content, votes: 0 }]
    return [...newState].sort((x, y) => y.votes - x.votes)
  }
  default:
    return state
  }
}

// action creators
export const voteAnecdote = (id) => ({ type: 'VOTE', payload: id })
export const createAnecdote = (content) => ({ type: 'ADD_ANECDOTE', payload: content })

export default anecdoteReducer
