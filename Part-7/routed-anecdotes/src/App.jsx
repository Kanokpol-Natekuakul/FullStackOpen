import { useState } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import Anecdote from './components/Anecdote'
import CreateNew from './components/CreateNew'
import About from './components/About'
import Footer from './components/Footer'
import Notification from './components/Notification'

const anecdotesData = [
  { content: 'If it hurts, do it more often', author: 'Jez Humble', info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html', votes: 0, id: 1 },
  { content: 'Premature optimization is the root of all evil', author: 'Donald Knuth', info: 'http://wiki.c2.com/?PrematureOptimization', votes: 0, id: 2 },
  { content: 'Debugging is twice as hard as writing the code in the first place', author: 'Brian W. Kernighan', info: 'https://www.goodreads.com/quotes/1049841', votes: 0, id: 3 },
  { content: 'Adding manpower to a late software project makes it later', author: 'Fred Brooks', info: 'http://www.amazon.com/Mythical-Man-Month-Software-Engineering-Anniversary/dp/0201835959', votes: 0, id: 4 },
  { content: 'The first 90 percent of the code accounts for the first 90 percent of the development time', author: 'Tom Cargill', info: 'https://en.wikipedia.org/wiki/Ninety-ninety_rule', votes: 0, id: 5 },
  { content: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand', author: 'Martin Fowler', info: 'http://www.goodreads.com/quotes/835grossly', votes: 0, id: 6 }
]

const AnecdoteView = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))
  if (!anecdote) return <div>anecdote not found</div>
  return <Anecdote anecdote={anecdote} />
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState(anecdotesData)
  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    setAnecdotes(anecdotes.concat({ ...anecdote, id: Math.round(Math.random() * 10000) }))
  }

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <BrowserRouter>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <Notification message={notification} />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/anecdotes/:id" element={<AnecdoteView anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} notify={notify} />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
