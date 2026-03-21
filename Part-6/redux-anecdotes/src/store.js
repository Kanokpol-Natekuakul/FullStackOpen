import { createStore } from 'redux'
import anecdoteReducer from './reducer'

const store = createStore(anecdoteReducer)

export default store
