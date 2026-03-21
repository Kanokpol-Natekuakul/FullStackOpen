const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 1, marginBottom: 10 }}>
      {message}
    </div>
  )
}

export default Notification
