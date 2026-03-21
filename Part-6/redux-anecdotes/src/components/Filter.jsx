import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()
  const value = useSelector(state => state.filter)

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value))
  }

  const style = { marginBottom: 10 }

  return (
    <div style={style}>
      filter <input onChange={handleChange} value={value} />
    </div>
  )
}

export default Filter
