import { useEffect, useRef, useState } from 'react'
import Filter from '../components/Filter'
import Form from '../components/Form'
import Notification from '../components/Notification'
import Persons from '../components/Persons'
import personService from './services/persons'
import './phonebook.css'

const App = () => {
  const [persons, setPersons] = useState([  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimeoutRef = useRef(null)


  // npm install axios
  // npm install json-server --save-dev || npx json-server --port 3001 --watch db.json
  useEffect(()=>{
    personService.getAll()
    .then(initialPersons=>{
      setPersons(initialPersons)
    })
  },[])

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })

    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }

    notificationTimeoutRef.current = setTimeout(() => {
      setNotification(null)
      notificationTimeoutRef.current = null
    }, 5000)
  }

  const addPersons = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      if (!window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService.update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(currentPersons =>
            currentPersons.map(person =>
              person.id === returnedPerson.id ? returnedPerson : person
            )
          )
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}`)
        })
        .catch(error => {
          if (error.response?.status === 404) {
            showNotification(
              `Information of ${existingPerson.name} has already been removed from server`,
              'error'
            )
            setPersons(currentPersons =>
              currentPersons.filter(person => person.id !== existingPerson.id)
            )
            return
          }

          showNotification(
            error.response?.data?.error ?? `Failed to update ${existingPerson.name}`,
            'error'
          )
        })
      return
    }

    const person = {
      name: newName,
      number: newNumber
    }

    personService.create(person)
      .then(returnedPerson => {
        setPersons(currentPersons => currentPersons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`)
      })
      .catch(error => {
        showNotification(
          error.response?.data?.error ?? `Failed to add ${person.name}`,
          'error'
        )
      })
  }

  const deletePerson = (personToDelete) => {
    if (!window.confirm(`Delete ${personToDelete.name}?`)) {
      return
    }

    personService.remove(personToDelete.id)
      .then(() => {
        setPersons(currentPersons =>
          currentPersons.filter(person => person.id !== personToDelete.id)
        )
      })
      .catch(() => {
        showNotification(
          `Information of ${personToDelete.name} has already been removed from server`,
          'error'
        )
        setPersons(currentPersons =>
          currentPersons.filter(person => person.id !== personToDelete.id)
        )
      })
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
    <div className="phonebook-app">
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
      <Persons persons={personsShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
