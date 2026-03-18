import { useEffect, useState } from 'react'
import axios from 'axios'
import Filter from '../components/Filter'
import Form from '../components/Form'
import Persons from '../components/Persons'

const App = () => {
  const [persons, setPersons] = useState([  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')


  // npm install axios
  // npm install json-server --save-dev || npx json-server --port 3001 --watch db.json
  useEffect(()=>{
    axios.get('http://localhost:3001/persons')
    .then(response=>{
      setPersons(response.data)
    })
  },[])

  const addPersons = (event) => {
    event.preventDefault()
    const nameexists = persons.some(
      person => person.name === newName
    )
    if (nameexists) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    const person = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(person))
    setNewName('')
    setNewNumber('')
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const personsShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearchChange={handleSearchChange}/>
      <h2>Add a new</h2>
      <Form 
        addPersons={addPersons}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsShow}/>
    </div>
  )
}

export default App