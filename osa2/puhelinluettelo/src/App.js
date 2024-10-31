import {useEffect, useState} from 'react'
import './App.css'
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Notification from "./components/Notification";
import personService from "./services/persons"

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [message, setMessage] = useState(null)
    const [errorState, setErrorState] = useState(false)

  const getPersons = () => {
    personService
        .getAll()
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
      if(window.confirm(newName + " is already added to phonebook, replace the old number with a new one?")){
          const newPerson = {
              name: newName,
              number: newNumber
          }
          const id = persons.find(person => person.name === newName).id
          personService
              .update(id, newPerson)
              .then(response => {
                  console.log(response)
                  setNewName('')
                  setNewNumber('')
                  setMessage(newName + ' updated')
                  setTimeout(()=>{
                      setMessage(null)
                  }, 5000)
                  getPersons()
              })
              .catch(error => {
                  console.log(error)
                  setErrorState(true)
                  setMessage('Information of ' + newName + ' has already been removed from the server')
                  setTimeout(()=>{
                      setMessage(null)
                      setErrorState(false)
                  }, 5000)
              })
      }
    }else{
      const newPerson = {
        name: newName,
        number: newNumber
      }
      personService
          .create(newPerson)
          .then(response => {
              setPersons(persons.concat(response.data["returnPerson"]))
              setNewName('')
              setNewNumber('')
              setMessage('Added ' + newName)
              setTimeout(()=>{
                  setMessage(null)
              }, 5000)
          })
          .catch(error => {
              console.log(error)
              setErrorState(true)
              setMessage('Name or number fields not filled')
              setTimeout(()=>{
                  setMessage(null)
                  setErrorState(false)
              }, 5000)
          })
    }
  }

  const deletePerson = (id, name) =>{
      if(window.confirm("Delete " + name + "?")){
          personService
              .del(id)
              .then(response => {
                  console.log(response)
                  getPersons()
                  setMessage(name + ' deleted')
                  setTimeout(()=>{
                      setMessage(null)
                  }, 5000)
              })
      }
  }

  const personsToShow = filter === ''
      ? persons
      : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
      <div>
          <Notification isError={errorState} message={message}/>
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
          <Persons persons={personsToShow} deleteFn={deletePerson}/>
      </div>
  )
}

export default App
