import React from 'react';
import useStoreon from 'storeon/react'

export const App = () => {
  const { dispatch, count } = useStoreon('count')
  return (
    <>
      <h1>The count is {count}</h1>

      <button onClick={() => dispatch('start')}>Start</button>
      <button onClick={() => dispatch('stop')}>Stop</button>
      <button onClick={() => dispatch('reset')}>Reset</button>
    </>
  )
}

