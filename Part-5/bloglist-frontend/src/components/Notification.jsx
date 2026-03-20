const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const notificationStyle = {
    border: `1px solid ${notification.type === 'error' ? '#a33' : '#2f6f3e'}`,
    color: notification.type === 'error' ? '#7a2222' : '#23552f',
    backgroundColor: notification.type === 'error' ? '#f7e6e6' : '#ebf7ee',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
  }

  return (
    <div style={notificationStyle}>
      {notification.message}
    </div>
  )
}

export default Notification
