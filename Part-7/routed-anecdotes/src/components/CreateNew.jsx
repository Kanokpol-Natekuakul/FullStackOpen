import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = ({ addNew, notify }) => {
  const navigate = useNavigate()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({ content: content.value, author: author.value, info: info.value, votes: 0 })
    notify(`a new anecdote '${content.value}' created!`)
    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  // exclude reset from props spread onto <input>
  const inputProps = ({ reset, ...rest }) => rest

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>content <input {...inputProps(content)} /></div>
        <div>author <input {...inputProps(author)} /></div>
        <div>url for more info <input {...inputProps(info)} /></div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
