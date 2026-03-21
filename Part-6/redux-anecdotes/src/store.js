import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer, { fetchAnecdotes } from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
	reducer: {
		anecdotes: anecdoteReducer,
		filter: filterReducer,
		notification: notificationReducer
	},
	devTools: process.env.NODE_ENV !== 'production'
})

// initialize store by fetching anecdotes from backend
store.dispatch(fetchAnecdotes())

export default store
