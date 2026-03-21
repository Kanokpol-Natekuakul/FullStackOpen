import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { showNotification } from '../reducers/notificationReducer'

const blogStyle = {
  paddingTop: 10, paddingRight: 8, paddingBottom: 10,
  paddingLeft: 8, border: 'solid', borderWidth: 1, marginBottom: 8
}

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const canRemove = blog.user?.username === user?.username

  const handleLike = () => {
    dispatch(likeBlog(blog))
    dispatch(showNotification(`you liked '${blog.title}'`))
  }

  const handleDelete = () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return
    dispatch(deleteBlog(blog))
    dispatch(showNotification(`blog '${blog.title}' deleted`))
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(v => !v)}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user?.name || blog.user?.username}</div>
          {canRemove && <button onClick={handleDelete}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
