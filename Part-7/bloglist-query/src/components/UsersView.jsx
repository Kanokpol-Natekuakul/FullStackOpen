import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/users'

const UsersView = () => {
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getAll })

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead><tr><th>name</th><th>blogs created</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView
