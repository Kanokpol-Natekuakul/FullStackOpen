import { useState } from 'react'

const Button = ({ onClick,text})=>{
  return(
    <button onClick = {onClick}>{text}</button>
  )
}
const Text = ({text,value})=>{
  return (
    <p>{text}{value}</p>
  )
}
const Statistics = (props) => {
  const { good, neutral, bad } = props
  const all = good + neutral + bad

  if (all === 0) {
    return (<div><h1>Statistics</h1><p>No feedback given</p></div>)
  }
  const average = (good - bad) / all
  const positive = (good / all) * 100


  return (
    <div>
      <h1>Statistics</h1>
      <Text text="good" value={good} />
      <Text text="neutral" value={neutral} />
      <Text text="bad" value={bad} />
      <Text text="all" value={all} />
      <Text text="average" value={average} />
      <Text text="positive" value={positive + " %"} />
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text="good"/>
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button onClick={() => setBad(bad + 1)} text="bad"/>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App