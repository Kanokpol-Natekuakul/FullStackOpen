const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Part = (props) => {
  return (<p>{props.name} {props.exercises}</p>)
}

const Content = (props) => {
  return (
    <div>

      <Part name={props.part1.name} exercises={props.part1.exercises1} />
      <Part name={props.part2.name} exercises={props.part2.exercises2} />
      <Part name={props.part3.name} exercises={props.part3.exercises3} />

    </div>
  )
}

const Total = (props) => {
  return (
    <p>
      Number of exercises {props.part1.exercises1 + props.part2.exercises2 + props.part3.exercises3}
    </p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises1: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises2: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises3: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content
        part1={part1}

        part2={part2}
        part3={part3}
      />
      <Total
        part1={part1}
        part2={part2}
        part3={part3}

      />
    </div>
  )
}

export default App