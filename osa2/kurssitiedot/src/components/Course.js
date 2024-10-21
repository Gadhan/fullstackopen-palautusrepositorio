const Header = (props) => {
    return <h2>{props.header}</h2>;
}

const Content  = (props) => {
    return <div>
        {props.parts.map(parts => <Part key={parts.id} part={parts}/>)}
    </div>
}

const Part = (props) => {
    return <p>{props.part.name + " " + props.part.exercises}</p>
}

const Total = (props) => {
    let total = 0
    total = props.parts.reduce( (acc, cur) => {return acc + cur.exercises}, total)
    return <p><b>Number of exercises {total}</b></p>
}

const Course = (props) => {
    return (
        <div>
            <Header header={props.course.name}/>
            <Content parts={props.course.parts}/>
            <Total parts={props.course.parts}/>
        </div>
    )
}

export default Course
