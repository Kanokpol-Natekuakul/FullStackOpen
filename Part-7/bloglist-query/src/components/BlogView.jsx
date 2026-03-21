import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, update, remove, addComment } from '../services/blogs'
import { useUser } from '../context/UserContext'
import { useShowNotification } from '../context/NotificationContext'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user] = useUser()
  const showNotification = useShowNotification()
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const { data: blogs = [] } = useQuery({ queryKey: ['blogs'], queryFn: getAll })
  const blog = blogs.find(b => b.id === id)

  const likeMutation = useMutation({
    mutationFn: () => update(id, { ...blog, user: blog.user?.id || blog.user, likes: blog.likes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(`you liked '${blog.title}'`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(`blog '${blog.title}' deleted`)
      navigate('/')
    }
  })

  const commentMutation = useMutation({
    mutationFn: () => addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      setComment('')
    }
  })

  if (!blog) return null

  const canRemove = blog.user?.username === user?.username

  return (
    <div>
      <h2>{blog.title} — {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>likes {blog.likes} <button onClick={() => likeMutation.mutate()}>like</button></div>
      <div>added by {blog.user?.name || blog.user?.username}</div>
      {canRemove && <button onClick={() => { if (window.confirm(`Remove ${blog.title}?`)) deleteMutation.mutate() }}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={e => { e.preventDefault(); commentMutation.mutate() }}>
        <input value={comment} onChange={e => setComment(e.target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments || []).map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  )
}

export default BlogView
