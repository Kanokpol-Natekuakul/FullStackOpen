import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'

const navStyle = {
  display: 'flex', gap: '1rem', alignItems: 'center',
  padding: '0.5rem 1rem', background: '#f0f0f0', marginBottom: '1rem'
}

const Nav = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  return (
    <nav style={navStyle}>
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      {user && (
        <span style={{ marginLeft: 'auto' }}>
          {user.name} logged in
          <button onClick={() => dispatch(logoutUser())} style={{ marginLeft: '0.5rem' }}>logout</button>
        </span>
      )}
    </nav>
  )
}

export default Nav
