import React from 'react'

const Form = ({addPersons,newName,newNumber,handleNameChange,handleNumberChange}) => {
  return (
    <form onSubmit={addPersons}>
        <div>

          <div>
            name: <input value={newName} onChange={handleNameChange} />
          </div>
          <div>
            number: <input value={newNumber} onChange={handleNumberChange} />
          </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

export default Form