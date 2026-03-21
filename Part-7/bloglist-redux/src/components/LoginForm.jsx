import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../reducers/userReducer'
import { showNotification } from '../reducers/notificationReducer'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await dispatch(loginUser({ username, password }))
      dispatch(showNotification(`${user.name} logged in`))
      setUsername('')
      setPassword('')
    } catch {
      dispatch(showNotification('wrong username or password', 'error'))
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>username <input type="text" value={username} name="Username" onChange={e => setUsername(e.target.value)} /></div>
        <div>password <input type="password" value={password} name="Password" onChange={e => setPassword(e.target.value)} /></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
