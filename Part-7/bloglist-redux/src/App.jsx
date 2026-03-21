import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logoutUser } from './reducers/userReducer'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => [...state.blogs].sort((a, b) => b.likes - a.likes))
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  useEffect(() => {
    if (user) dispatch(initializeBlogs())
  }, [user, dispatch])

  if (!user) {
    return (
      <div>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button onClick={() => dispatch(logoutUser())}>logout</button>
      </div>
      <br />
      {formVisible
        ? <><BlogForm onCreated={() => setFormVisible(false)} /><button onClick={() => setFormVisible(false)}>cancel</button></>
        : <button onClick={() => setFormVisible(true)}>create new blog</button>
      }
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App
