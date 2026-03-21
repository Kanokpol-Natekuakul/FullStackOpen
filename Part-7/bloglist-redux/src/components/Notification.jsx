import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (!notification) return null

  const style = {
    border: `1px solid ${notification.type === 'error' ? '#a33' : '#2f6f3e'}`,
    color: notification.type === 'error' ? '#7a2222' : '#23552f',
    backgroundColor: notification.type === 'error' ? '#f7e6e6' : '#ebf7ee',
    padding: '0.75rem 1rem',
    marginBottom: '1rem'
  }

  return <div style={style}>{notification.message}</div>
}

export default Notification
