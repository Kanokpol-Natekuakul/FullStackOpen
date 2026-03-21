import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LOCAL_KEY = 'loggedBlogappUser'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

export const initializeUser = () => (dispatch) => {
  const stored = window.localStorage.getItem(LOCAL_KEY)
  if (stored) {
    const user = JSON.parse(stored)
    dispatch(setUser(user))
    blogService.setToken(user.token)
  }
}

export const loginUser = (credentials) => async (dispatch) => {
  const user = await loginService.login(credentials)
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
  blogService.setToken(user.token)
  dispatch(setUser(user))
  return user
}

export const logoutUser = () => (dispatch) => {
  window.localStorage.removeItem(LOCAL_KEY)
  blogService.setToken(null)
  dispatch(clearUser())
}

export default userSlice.reducer
