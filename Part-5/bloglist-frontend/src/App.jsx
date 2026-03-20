import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const localStorageKey = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [blogFormVisible, setBlogFormVisible] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(localStorageKey)

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  useEffect(() => {
    if (user === null) {
      setBlogs([])
      return
    }

    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [user])

  useEffect(() => {
    if (notification === null) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setNotification(null)
    }, 5000)

    return () => clearTimeout(timeoutId)
  }, [notification])

  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(localStorageKey, JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      setUsername('')
      setPassword('')
      showNotification(`${loggedInUser.name} logged in`, 'success')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageKey)
    blogService.setToken(null)
    setUser(null)
    setBlogFormVisible(false)
  }

  const resetBlogForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
    setBlogFormVisible(false)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const createdBlog = await blogService.create({
        title,
        author,
        url,
      })

      setBlogs(blogs.concat(createdBlog))
      resetBlogForm()
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch {
      showNotification('blog could not be created', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      <Togglable
        buttonLabel="create new blog"
        visible={blogFormVisible}
        onToggle={() => {
          if (blogFormVisible) {
            resetBlogForm()
            return
          }

          setBlogFormVisible(true)
        }}
      >
        <h3>create new</h3>
        <form onSubmit={handleCreateBlog}>
          <div>
            title
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
