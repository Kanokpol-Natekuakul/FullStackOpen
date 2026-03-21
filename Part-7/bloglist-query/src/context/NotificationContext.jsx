import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET': return { message: action.message, kind: action.kind }
    case 'CLEAR': return null
    default: return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, null)
  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)

export const useShowNotification = () => {
  const [, dispatch] = useNotification()
  return (message, kind = 'success', seconds = 5) => {
    dispatch({ type: 'SET', message, kind })
    setTimeout(() => dispatch({ type: 'CLEAR' }), seconds * 1000)
  }
}
