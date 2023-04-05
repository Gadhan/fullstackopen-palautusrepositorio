import {useEffect, useState} from 'react'
import axios from "axios";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const getPersons = () => {
    axios
        .get('http://localhost:3001/persons')
        .then(response => {
          setPersons(response.data)
        })
  }

  useEffect(getPersons, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    let names = []
    names = persons.reduce((acc, cur) => {
      acc.push(cur.name)
      return acc
    }, names)
    if(names.includes(newName)){
      alert(newName + " is already added to phonebook")
    }else{
      const newPerson = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(newPerson))
    }
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = filter === ''
      ? persons
      : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
      <div>
        <h2>Phonebook</h2>
        <Filter filter={filter} onChange={handleFilterChange}/>
        <h3>add a new</h3>
        <PersonForm
            onSubmit={addPerson}
            name={newName}
            nameOnChange={handleNameChange}
            number={newNumber}
            numberOnChange={handleNumberChange} />
        <h3>Numbers</h3>
        <Persons persons={personsToShow} />
      </div>
  )
}

export default App
