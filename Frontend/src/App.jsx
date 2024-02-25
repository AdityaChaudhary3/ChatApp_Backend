import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'


function App() {

  const [res, setRes] = useState({})

  useEffect(() => {
    axios.get('/api')
      .then((response) => {
        setRes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <>
      <h1>Here is frontend.</h1>
      <h2>{res.hi}</h2>
      <Button colorScheme='blue'>Button</Button>
    </>
  )
}

export default App
