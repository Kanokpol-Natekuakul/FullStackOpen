import { createContext, useContext, useReducer } from 'react'
import { setToken } from '../services/blogs'

const UserContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET': return action.user
    case 'CLEAR': return null
    default: return state
  }
}

const LOCAL_KEY = 'loggedBlogappUser'

export const UserProvider = ({ children }) => {
  const stored = localStorage.getItem(LOCAL_KEY)
  const initial = stored ? JSON.parse(stored) : null
  if (initial) setToken(initial.token)

  const [user, dispatch] = useReducer(reducer, initial)
  return (
    <UserContext.Provider value={[user, dispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export const useUserActions = () => {
  const [, dispatch] = useUser()
  return {
    login: (user) => {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(user))
      setToken(user.token)
      dispatch({ type: 'SET', user })
    },
    logout: () => {
      localStorage.removeItem(LOCAL_KEY)
      setToken(null)
      dispatch({ type: 'CLEAR' })
    }
  }
}
