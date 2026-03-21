// filterReducer manages the current text filter for anecdotes
const initialFilter = ''

const filterReducer = (state = initialFilter, action) => {
  switch (action.type) {
  case 'SET_FILTER':
    return action.payload
  default:
    return state
  }
}

export const setFilter = (value) => ({ type: 'SET_FILTER', payload: value })

export default filterReducer
