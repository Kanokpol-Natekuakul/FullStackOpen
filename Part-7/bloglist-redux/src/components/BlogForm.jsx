import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const BlogForm = ({ onCreated }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const created = await dispatch(createBlog({ title, author, url }))
      dispatch(showNotification(`a new blog ${created.title} by ${created.author} added`))
      setTitle('')
      setAuthor('')
      setUrl('')
      onCreated()
    } catch {
      dispatch(showNotification('blog could not be created', 'error'))
    }
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <div>title <input value={title} name="Title" onChange={e => setTitle(e.target.value)} /></div>
        <div>author <input value={author} name="Author" onChange={e => setAuthor(e.target.value)} /></div>
        <div>url <input value={url} name="Url" onChange={e => setUrl(e.target.value)} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm
