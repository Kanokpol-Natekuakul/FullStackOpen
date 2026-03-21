import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import Notification from './components/Notification'
import Nav from './components/Nav'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import UsersView from './components/UsersView'
import UserView from './components/UserView'

const App = () => {
  const [user] = useUser()

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
