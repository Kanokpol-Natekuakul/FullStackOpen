import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      const token = login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    },
    onError: (error) => {
      console.error(error.graphQLErrors[0]?.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={handleSubmit}>
        <div>username <input value={username} onChange={e => setUsername(e.target.value)} /></div>
        <div>password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
