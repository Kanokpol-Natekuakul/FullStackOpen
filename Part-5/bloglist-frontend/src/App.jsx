import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const localStorageKey = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

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
      setErrorMessage(null)
    } catch {
      setErrorMessage('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(localStorageKey)
    blogService.setToken(null)
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {errorMessage && <div>{errorMessage}</div>}
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
      <h2>blogs</h2>
      <div>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
