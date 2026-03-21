import { Link } from 'react-router-dom'
import { useUser, useUserActions } from '../context/UserContext'

const navStyle = {
  display: 'flex', gap: '1rem', alignItems: 'center',
  padding: '0.5rem 1rem', background: '#f0f0f0', marginBottom: '1rem'
}

const Nav = () => {
  const [user] = useUser()
  const { logout } = useUserActions()

  return (
    <nav style={navStyle}>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      {user && (
        <span style={{ marginLeft: 'auto' }}>
          {user.name} logged in
          <button onClick={logout} style={{ marginLeft: '0.5rem' }}>logout</button>
        </span>
      )}
    </nav>
  )
}

export default Nav
