import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from '../services/blogs'
import { useShowNotification } from '../context/NotificationContext'

const BlogForm = ({ onCreated }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const queryClient = useQueryClient()
  const showNotification = useShowNotification()

  const mutation = useMutation({
    mutationFn: create,
    onSuccess: (blog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      showNotification(`a new blog ${blog.title} by ${blog.author} added`)
      setTitle(''); setAuthor(''); setUrl('')
      onCreated()
    },
    onError: () => showNotification('blog could not be created', 'error')
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ title, author, url })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <div>title <input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div>author <input value={author} onChange={e => setAuthor(e.target.value)} /></div>
        <div>url <input value={url} onChange={e => setUrl(e.target.value)} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
