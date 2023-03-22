import { useState } from 'react'

const Statistics = ({good, neutral, bad, average, positive}) => {
    return (
        <div>
            <h1>statistics</h1>
            {good>0||neutral>0||bad>0?
                <div>
                    <StatisticLine text="good" value={good}/>
                    <StatisticLine text="neutral" value={neutral}/>
                    <StatisticLine text="bad" value={bad}/>
                    <StatisticLine text="average" value={average}/>
                    <StatisticLine text="positive" value={positive}/>
                </div>:<p>No feedback given</p>}
        </div>
    )
}

const Button = (props) => {
    return <button onClick={props.function}>{props.label}</button>
}

const StatisticLine = (props) => {
    return <p>{props.text} {props.value}</p>
}

const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const calcAverage = () => {
        return (good - bad)/(good + neutral + bad)
    }

    const calcPosPerc = () => {
        return ( good / (good + neutral + bad )) * 100 + "%"
    }

    return (
        <div>
            <h1>give feedback</h1>
            <Button label="good" function={() => setGood(good + 1)} />
            <Button label="neutral" function={() => setNeutral(neutral + 1)} />
            <Button label="bad" function={() => setBad(bad + 1)} />
            <Statistics good={good} neutral={neutral} bad={bad} average={calcAverage()} positive={calcPosPerc()}/>
        </div>
    )
}

export default App
