import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET': return action.message
    case 'CLEAR': return ''
    default: return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, '')

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)

export const useShowNotification = () => {
  const [, dispatch] = useNotification()
  return (message, seconds = 5) => {
    dispatch({ type: 'SET', message })
    setTimeout(() => dispatch({ type: 'CLEAR' }), seconds * 1000)
  }
}
