import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/blogs'
import BlogForm from './BlogForm'
import { useState } from 'react'

const BlogList = () => {
  const [formVisible, setFormVisible] = useState(false)
  const { data: blogs = [], isLoading } = useQuery({ queryKey: ['blogs'], queryFn: getAll })

  if (isLoading) return <div>loading...</div>

  const sorted = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h2>blogs</h2>
      {formVisible
        ? <><BlogForm onCreated={() => setFormVisible(false)} /><button onClick={() => setFormVisible(false)}>cancel</button></>
        : <button onClick={() => setFormVisible(true)}>create new blog</button>
      }
      <br /><br />
      {sorted.map(b => (
        <div key={b.id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '0.5rem' }}>
          <Link to={`/blogs/${b.id}`}>{b.title}</Link> — {b.author}
        </div>
      ))}
    </div>
  )
}

export default BlogList
