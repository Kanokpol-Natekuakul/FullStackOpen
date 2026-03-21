import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Statistic = ({ label, value }) => (
  <div className="stat">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
)

function App() {
  const { good, ok, bad } = useSelector((state) => state)
  const dispatch = useDispatch()

  const total = good + ok + bad
  const average = total === 0 ? 0 : ((good - bad) / total).toFixed(2)
  const positive = total === 0 ? '0 %' : `${((good / total) * 100).toFixed(1)} %`

  return (
    <div className="container">
      <h1>Unicafe</h1>

      <div className="buttons">
        <button onClick={() => dispatch({ type: 'GOOD' })}>good</button>
        <button onClick={() => dispatch({ type: 'OK' })}>ok</button>
        <button onClick={() => dispatch({ type: 'BAD' })}>bad</button>
        <button className="reset" onClick={() => dispatch({ type: 'RESET' })}>reset stats</button>
      </div>

      <h2>statistics</h2>
      <div className="stats">
        <Statistic label="good" value={good} />
        <Statistic label="ok" value={ok} />
        <Statistic label="bad" value={bad} />
        <Statistic label="all" value={total} />
        <Statistic label="average" value={average} />
        <Statistic label="positive" value={positive} />
      </div>
    </div>
  )
}

export default App
