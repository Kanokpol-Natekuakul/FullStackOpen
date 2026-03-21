import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')

  const blog = blogs.find(b => b.id === id)
  if (!blog) return null

  const canRemove = blog.user?.username === user?.username

  const handleLike = () => {
    dispatch(likeBlog(blog))
    dispatch(showNotification(`you liked '${blog.title}'`))
  }

  const handleDelete = () => {
    if (!window.confirm(`Remove ${blog.title}?`)) return
    dispatch(deleteBlog(blog))
    dispatch(showNotification(`blog '${blog.title}' deleted`))
    navigate('/')
  }

  const handleComment = (e) => {
    e.preventDefault()
    dispatch(commentBlog(id, comment))
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title} — {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
      <div>added by {blog.user?.name || blog.user?.username}</div>
      {canRemove && <button onClick={handleDelete}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={handleComment}>
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
