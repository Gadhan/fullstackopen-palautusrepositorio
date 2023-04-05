const Persons = (props) => {
    return(
        props.persons.map(person => <div key={person.id}>
            {person.name + " " + person.number + " "}
            <button onClick={() => props.deleteFn(person.id, person.name)}>delete</button></div>)
    )
}

export default Persons
