import { useState } from 'react'
import { useUserActions } from '../context/UserContext'
import { useShowNotification } from '../context/NotificationContext'
import { login as loginService } from '../services/login'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useUserActions()
  const showNotification = useShowNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService({ username, password })
      login(user)
      showNotification(`${user.name} logged in`)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>username <input type="text" value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div>password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
