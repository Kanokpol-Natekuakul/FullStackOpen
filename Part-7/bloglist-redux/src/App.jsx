import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { initializeUser } from './reducers/userReducer'
import { showNotification } from './reducers/notificationReducer'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import Nav from './components/Nav'
import UsersView from './components/UsersView'
import UserView from './components/UserView'

const BlogList = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => [...state.blogs].sort((a, b) => b.likes - a.likes))
  const [formVisible, setFormVisible] = useState(false)

  return (
    <div>
      <h2>blogs</h2>
      {formVisible
        ? <><BlogForm onCreated={() => setFormVisible(false)} /><button onClick={() => setFormVisible(false)}>cancel</button></>
        : <button onClick={() => setFormVisible(true)}>create new blog</button>
      }
      <br /><br />
      {blogs.map(b => <Blog key={b.id} blog={b} />)}
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => { dispatch(initializeUser()) }, [dispatch])
  useEffect(() => { if (user) dispatch(initializeBlogs()) }, [user, dispatch])

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
      <Nav />
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<UsersView />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
