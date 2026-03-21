import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAll } from '../services/users'

const UserView = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    getAll().then(users => setUser(users.find(u => u.id === id)))
  }, [id])

  if (!user) return null

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(b => <li key={b.id}>{b.title}</li>)}
      </ul>
    </div>
  )
}

export default UserView
