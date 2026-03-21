import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Welcome to the Anecdotes app',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer

// thunk action creator to show a message for a given duration (ms)
export const showNotification = (message, ms = 5000) => {
  return async (dispatch) => {
    dispatch(setNotification(message))
    setTimeout(() => dispatch(clearNotification()), ms)
  }
}
import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Welcome to the Anecdotes app!',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export default notificationSlice.reducer
